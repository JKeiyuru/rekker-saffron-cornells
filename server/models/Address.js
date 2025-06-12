const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    county: { type: String, required: true },
    district: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    notes: String,
    deliveryCharge: { type: Number, required: true }, // Calculated based on location
    isDefault: { type: Boolean, default: false }, // Allow users to set a default address
  },
  { timestamps: true }
);

// Index for faster queries
AddressSchema.index({ userId: 1 });
AddressSchema.index({ county: 1, district: 1, location: 1 });

// Method to get full address string
AddressSchema.methods.getFullAddress = function() {
  return `${this.location}, ${this.district}, ${this.county}`;
};

// Static method to find addresses by location for delivery charge calculation
AddressSchema.statics.findByLocation = function(county, district, location) {
  return this.find({ county, district, location });
};

module.exports = mongoose.model("Address", AddressSchema);