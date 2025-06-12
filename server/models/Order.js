const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  cartItems: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      image: String,
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  addressInfo: {
    addressId: String,
    county: { type: String, required: true },
    district: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    notes: String,
    deliveryCharge: { type: Number, required: true },
    fullAddress: String, // Computed field for display: "Location, District, County"
  },
  orderStatus: { 
    type: String, 
    default: "pending",
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
  },
  paymentMethod: { type: String, required: true }, // e.g. 'paypal', 'mpesa'
  paymentStatus: { 
    type: String, 
    default: "pending",
    enum: ["pending", "completed", "failed", "refunded"]
  },
  totalAmount: { type: Number, required: true }, // Total including delivery
  subtotalAmount: { type: Number, required: true }, // Subtotal without delivery
  deliveryAmount: { type: Number, required: true }, // Delivery charge
  orderDate: { type: Date, default: Date.now },
  orderUpdateDate: { type: Date, default: Date.now },
  paymentId: String, // PayPal or Mpesa transaction ID
  payerId: String,   // PayPal payer ID or Mpesa customer id
  
  // Additional fields for better order management
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  trackingNumber: String,
  deliveryNotes: String,
});

// Indexes for better query performance
OrderSchema.index({ userId: 1, orderDate: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ "addressInfo.county": 1, "addressInfo.district": 1, "addressInfo.location": 1 });

// Pre-save middleware to update orderUpdateDate and calculate fullAddress
OrderSchema.pre('save', function(next) {
  this.orderUpdateDate = new Date();
  
  // Set full address for display purposes
  if (this.addressInfo && this.addressInfo.location && this.addressInfo.district && this.addressInfo.county) {
    this.addressInfo.fullAddress = `${this.addressInfo.location}, ${this.addressInfo.district}, ${this.addressInfo.county}`;
  }
  
  next();
});

// Method to calculate total with delivery
OrderSchema.methods.calculateTotal = function() {
  const subtotal = this.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  this.subtotalAmount = subtotal;
  this.deliveryAmount = this.addressInfo.deliveryCharge || 0;
  this.totalAmount = subtotal + this.deliveryAmount;
  
  return this.totalAmount;
};

// Method to update order status with timestamp
OrderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.orderStatus = newStatus;
  this.orderUpdateDate = new Date();
  
  if (notes) {
    this.deliveryNotes = notes;
  }
  
  // Set actual delivery date when order is delivered
  if (newStatus === 'delivered') {
    this.actualDeliveryDate = new Date();
  }
  
  return this.save();
};

// Static method to find orders by location (useful for delivery management)
OrderSchema.statics.findByLocation = function(county, district, location) {
  return this.find({
    "addressInfo.county": county,
    "addressInfo.district": district,
    "addressInfo.location": location
  });
};

// Static method to get delivery statistics by location
OrderSchema.statics.getDeliveryStats = function(county, district, location) {
  return this.aggregate([
    {
      $match: {
        "addressInfo.county": county,
        "addressInfo.district": district,
        "addressInfo.location": location
      }
    },
    {
      $group: {
        _id: {
          county: "$addressInfo.county",
          district: "$addressInfo.district",
          location: "$addressInfo.location"
        },
        totalOrders: { $sum: 1 },
        totalDeliveryAmount: { $sum: "$deliveryAmount" },
        averageDeliveryCharge: { $avg: "$deliveryAmount" }
      }
    }
  ]);
};

module.exports = mongoose.model("Order", OrderSchema);