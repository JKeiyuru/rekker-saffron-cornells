// server/controllers/shop/order-controller.js
// Rekker shop order controller — handles COD, M-Pesa, and PayPal order creation.
// Fixed: createOrder now routes by paymentMethod instead of always running PayPal.
// Fixed: PayPal redirect URLs read from env so they work in production.

const paypal    = require("../../helpers/paypal");
const Order     = require("../../models/Order");
const Cart      = require("../../models/Cart");
const Product   = require("../../models/Product");
const User      = require("../../models/User");
const { createToken, stkPush } = require("../../helpers/mpesa");
const {
  sendOrderConfirmationEmail,
} = require("../../helpers/email");

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fire confirmation email without blocking the response
const fireConfirmationEmail = async (userId, order) => {
  try {
    const user = await User.findById(userId).select("email userName");
    if (user) {
      sendOrderConfirmationEmail(user, order).catch((e) =>
        console.error("Order confirmation email error:", e)
      );
    }
  } catch (e) {
    console.error("Could not send confirmation email:", e);
  }
};

// ─── CREATE ORDER — routes by paymentMethod ───────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      subtotalAmount,
      deliveryFee,
      orderDate,
      cartId,
    } = req.body;

    // Basic validation
    if (!userId || !cartItems?.length || !paymentMethod || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields (userId, cartItems, paymentMethod, totalAmount)",
      });
    }

    // ── CASH ON DELIVERY ─────────────────────────────────────────────────────
    if (paymentMethod === "cod") {
      const order = new Order({
        userId,
        cartId: cartId || null,
        cartItems,
        addressInfo,
        paymentMethod: "cod",
        paymentStatus: "pending",
        orderStatus: "pending",
        totalAmount,
        subtotalAmount: subtotalAmount || 0,
        deliveryFee: deliveryFee || 0,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
      });

      await order.save();
      fireConfirmationEmail(userId, order);

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        orderId: order._id,
      });
    }

    // ── PAYPAL ────────────────────────────────────────────────────────────────
    if (paymentMethod === "paypal") {
      const baseUrl =
        process.env.CLIENT_BASE_URL ||
        process.env.FRONTEND_URL ||
        "https://rekker.co.ke";

      const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
          return_url: `${baseUrl}/shop/paypal-return`,
          cancel_url: `${baseUrl}/shop/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map((item) => ({
                name: item.title,
                sku: item.productId,
                price: Number(item.price).toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: Number(totalAmount).toFixed(2),
            },
            description: "Rekker order payment",
          },
        ],
      };

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.error("PayPal create payment error:", error);
          return res.status(500).json({
            success: false,
            message: "Error creating PayPal payment",
          });
        }

        const order = new Order({
          userId,
          cartId: cartId || null,
          cartItems,
          addressInfo,
          paymentMethod: "paypal",
          paymentStatus: "pending",
          orderStatus: "pending",
          totalAmount,
          subtotalAmount: subtotalAmount || 0,
          deliveryFee: deliveryFee || 0,
          orderDate: orderDate ? new Date(orderDate) : new Date(),
        });

        await order.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        )?.href;

        return res.status(201).json({
          success: true,
          approvalURL,
          orderId: order._id,
        });
      });

      return; // PayPal callback handles the response
    }

    // ── UNKNOWN PAYMENT METHOD ────────────────────────────────────────────────
    return res.status(400).json({
      success: false,
      message: `Unknown payment method: ${paymentMethod}`,
    });

  } catch (e) {
    console.error("createOrder error:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error creating order",
    });
  }
};

// ─── CAPTURE PAYPAL PAYMENT ───────────────────────────────────────────────────
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus  = "paid";
    order.orderStatus    = "confirmed";
    order.paymentId      = paymentId;
    order.payerId        = payerId;

    // Decrement stock
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.totalStock = Math.max(0, product.totalStock - item.quantity);
        await product.save();
      }
    }

    // Clear cart
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    // Send confirmation email
    fireConfirmationEmail(order.userId, order);

    return res.status(200).json({
      success: true,
      message: "Payment captured — order confirmed",
      data: order,
    });
  } catch (e) {
    console.error("capturePayment error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── INITIATE M-PESA STK PUSH ─────────────────────────────────────────────────
const initiateMpesaPayment = async (req, res) => {
  try {
    const {
      phone,
      amount,
      orderData, // full order payload from checkout
    } = req.body;

    if (!phone || !amount || !orderData) {
      return res.status(400).json({
        success: false,
        message: "phone, amount, and orderData are required",
      });
    }

    // Save order first so we have an ID before the STK push
    const order = new Order({
      userId:         orderData.userId,
      cartId:         orderData.cartId || null,
      cartItems:      orderData.cartItems,
      addressInfo:    orderData.addressInfo,
      paymentMethod:  "mpesa",
      paymentStatus:  "pending",
      orderStatus:    "pending",
      totalAmount:    amount,
      subtotalAmount: orderData.subtotalAmount || 0,
      deliveryFee:    orderData.deliveryFee || 0,
      orderDate:      new Date(),
    });

    await order.save();

    // Initiate STK push
    const callbackUrl =
      process.env.MPESA_CALLBACK_URL ||
      `${process.env.API_BASE_URL || "https://api.rekker.co.ke"}/api/shop/mpesa/callback`;

    try {
      const token = await createToken();
      const stkResponse = await stkPush(token, phone, amount, callbackUrl);

      // Store checkout request ID for callback matching
      if (stkResponse.CheckoutRequestID) {
        order.mpesaCheckoutId = stkResponse.CheckoutRequestID;
        await order.save();
      }

      return res.status(200).json({
        success: true,
        message: "STK push sent — please enter your M-Pesa PIN",
        orderId: order._id,
        checkoutRequestId: stkResponse.CheckoutRequestID,
      });
    } catch (mpesaError) {
      // If STK push fails, mark order as failed but still return orderId
      console.error("STK push error:", mpesaError?.response?.data || mpesaError.message);
      order.paymentStatus = "failed";
      await order.save();

      return res.status(500).json({
        success: false,
        message: "M-Pesa STK push failed. Please try again or use a different payment method.",
        orderId: order._id,
      });
    }
  } catch (e) {
    console.error("initiateMpesaPayment error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET ALL ORDERS FOR A USER ────────────────────────────────────────────────
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    return res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error("getAllOrdersByUser error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET SINGLE ORDER DETAILS ─────────────────────────────────────────────────
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("getOrderDetails error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  initiateMpesaPayment,
  getAllOrdersByUser,
  getOrderDetails,
};