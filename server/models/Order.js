// server/models/Order.js
// Rekker Order Model — supports COD, M-Pesa, and PayPal payment methods.
// Fields are kept flexible so all checkout paths can save orders without errors.

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    // cartId is optional — new checkout flow does not pass it
    cartId: { type: String, default: null },

    cartItems: [
      {
        productId: { type: String, required: true },
        title:     { type: String, required: true },
        image:     { type: String, default: null },
        price:     { type: Number, required: true },
        quantity:  { type: Number, required: true },
        brand:     { type: String, default: null },
        selectedVariation: { type: String, default: null },
      },
    ],

    addressInfo: {
      // New Kenya-specific fields (used by current checkout)
      county:          { type: String, default: null },
      subCounty:       { type: String, default: null },
      location:        { type: String, default: null },
      specificAddress: { type: String, default: null },
      fullAddress:     { type: String, default: null },
      phone:           { type: String, default: null },
      notes:           { type: String, default: null },

      // Legacy / PayPal fields (kept for backward compat)
      addressId:    { type: String, default: null },
      address:      { type: String, default: null },
      city:         { type: String, default: null },
      pincode:      { type: String, default: null },
    },

    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "inProcess", "inShipping", "delivered", "rejected", "cancelled"],
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "mpesa", "paypal"],
    },

    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "refunded"],
    },

    totalAmount:    { type: Number, required: true },
    subtotalAmount: { type: Number, default: 0 },
    deliveryFee:    { type: Number, default: 0 },

    orderDate:       { type: Date, default: Date.now },
    orderUpdateDate: { type: Date, default: Date.now },

    // Payment provider fields
    paymentId: { type: String, default: null },
    payerId:   { type: String, default: null },

    // M-Pesa specific
    mpesaCheckoutId:  { type: String, default: null },
    mpesaCallbackData: { type: mongoose.Schema.Types.Mixed, default: null },

    // Delivery tracking
    estimatedDeliveryDate: { type: Date, default: null },
    actualDeliveryDate:    { type: Date, default: null },
    trackingNumber:        { type: String, default: null },
    deliveryNotes:         { type: String, default: null },
  },
  { timestamps: true }
);

// Indexes for query performance
OrderSchema.index({ userId: 1, orderDate: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ mpesaCheckoutId: 1 }, { sparse: true });

// Auto-update orderUpdateDate on every save
OrderSchema.pre("save", function (next) {
  this.orderUpdateDate = new Date();
  next();
});

module.exports = mongoose.model("Order", OrderSchema);