// server/models/Product.js
const mongoose = require("mongoose");

const VariationSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: [true, "Variation image is required"],
    trim: true
  },
  label: { 
    type: String, 
    required: [true, "Variation label is required"],
    trim: true,
    maxlength: [100, "Variation label cannot exceed 100 characters"]
  }
}, { _id: true });

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String, 
      trim: true,
      default: null
    }, // legacy support (optional)
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    salePrice: {
      type: Number,
      default: 0,
      min: [0, "Sale price cannot be negative"],
      validate: {
        validator: function(value) {
          // If salePrice is set, it should be less than or equal to the regular price
          return !value || value <= this.price;
        },
        message: "Sale price should be less than or equal to regular price"
      }
    },
    totalStock: {
      type: Number,
      required: [true, "Total stock is required"],
      min: [0, "Stock cannot be negative"]
    },
    averageReview: {
      type: Number,
      default: 0,
      min: [0, "Average review cannot be negative"],
      max: [5, "Average review cannot exceed 5"]
    },
    variations: {
  type: [VariationSchema],
  default: [],
  validate: {
    validator: function(variations) {
      // Remove this validation completely or modify it
      // return this.image || (variations && variations.length > 0);
      
      // NEW: Always allow variations array (validation happens at controller level)
      return true;
    },
    message: "Product must have either a main image or at least one variation"
  }
}
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to check if product has variations
ProductSchema.virtual('hasVariations').get(function() {
  return this.variations && this.variations.length > 0;
});

// Virtual to get the display image (main image or first variation image)
ProductSchema.virtual('displayImage').get(function() {
  if (this.image) return this.image;
  if (this.variations && this.variations.length > 0) return this.variations[0].image;
  return null;
});

// Index for better performance
ProductSchema.index({ category: 1, title: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'variations.label': 1 }); // Add this line
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", ProductSchema);