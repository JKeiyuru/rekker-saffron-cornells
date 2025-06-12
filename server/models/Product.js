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
}, { 
  _id: true
});

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String, 
      trim: true,
      default: null
    },
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
      default: []
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Custom validation: Product must have either main image or variations
ProductSchema.pre('validate', function(next) {
  // Check if both image and variations are empty/null
  const hasMainImage = this.image && this.image.trim().length > 0;
  const hasVariations = this.variations && Array.isArray(this.variations) && this.variations.length > 0;
  
  if (!hasMainImage && !hasVariations) {
    return next(new Error('Product must have either a main image or at least one variation'));
  }
  next();
});

// Virtual for display image
ProductSchema.virtual('displayImage').get(function() {
  if (this.image && this.image.trim().length > 0) return this.image;
  if (this.variations && this.variations.length > 0 && this.variations[0].image) {
    return this.variations[0].image;
  }
  return null;
});

// Indexes
ProductSchema.index({ category: 1, title: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", ProductSchema);