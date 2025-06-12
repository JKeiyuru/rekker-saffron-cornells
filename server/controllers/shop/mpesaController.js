const Order = require("../../models/Order");
const { createToken, stkPush } = require("../../helpers/mpesa");

const handleMpesaPaymentRequest = async (req, res) => {
  const { phone, amount, orderData } = req.body;

  try {
    const token = await createToken();

    const callbackUrl = "https://mydomain.com/api/shop/mpesa/callback"; // Adjust URL as needed

    const response = await stkPush(token, phone, amount, callbackUrl);

    if (response.ResponseCode === "0") {
      // Optionally save orderData to DB here
      return res.status(200).json({
        success: true,
        message: "STK push sent successfully",
        data: response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "STK push failed",
        data: response,
      });
    }
  } catch (err) {
    console.error("STK Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong with the STK push.",
    });
  }
};

const handleMpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    const order = await Order.findOne({ mpesaCheckoutId: checkoutId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.mpesaCallbackData = callbackData;
    order.paymentStatus = resultCode === 0 ? "paid" : "failed";
    order.orderStatus = resultCode === 0 ? "confirmed" : "cancelled";
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({ success: true, message: "Callback processed" });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  handleMpesaPaymentRequest,
  handleMpesaCallback,
};
