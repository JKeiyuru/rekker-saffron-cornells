// server/models/Product.js - Rekker Product Model
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
    brand: {
      type: String,
      required: [true, "Brand is required"],
      enum: {
        values: ["rekker", "saffron", "cornells"],
        message: "Brand must be either rekker, saffron, or cornells"
      },
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true
    },
    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
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
      min: [0, "Stock cannot be negative"],
      default: 0
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
      },
      virtuals: true
    },
    toObject: { 
      virtuals: true 
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
  
  // Validate subcategory requirement for Saffron and Cornells
  if ((this.brand === 'saffron' || this.brand === 'cornells') && !this.subcategory) {
    return next(new Error(`Subcategory is required for ${this.brand} products`));
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

// Virtual for brand display name
ProductSchema.virtual('brandDisplay').get(function() {
  const brandMap = {
    'rekker': 'Rekker',
    'saffron': 'Saffron',
    'cornells': 'Cornells'
  };
  return brandMap[this.brand] || this.brand;
});

// Indexes for better query performance
ProductSchema.index({ brand: 1, category: 1 });
ProductSchema.index({ brand: 1, category: 1, subcategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ title: 'text', description: 'text' });

// Static method to get products by brand
ProductSchema.statics.findByBrand = function(brand) {
  return this.find({ brand: brand.toLowerCase() });
};

// Static method to get products by brand and category
ProductSchema.statics.findByBrandAndCategory = function(brand, category) {
  return this.find({ 
    brand: brand.toLowerCase(), 
    category: category.toLowerCase() 
  });
};

// Static method to get products by brand, category, and subcategory
ProductSchema.statics.findByFullCategory = function(brand, category, subcategory) {
  const query = { 
    brand: brand.toLowerCase(), 
    category: category.toLowerCase()
  };
  
  if (subcategory) {
    query.subcategory = subcategory.toLowerCase();
  }
  
  return this.find(query);
};

// Instance method to check if product is on sale
ProductSchema.methods.isOnSale = function() {
  return this.salePrice > 0 && this.salePrice < this.price;
};

// Instance method to get effective price
ProductSchema.methods.getEffectivePrice = function() {
  return this.isOnSale() ? this.salePrice : this.price;
};

// Instance method to check if product is in stock
ProductSchema.methods.isInStock = function() {
  return this.totalStock > 0;
};

// Instance method to check if product is low stock
ProductSchema.methods.isLowStock = function(threshold = 10) {
  return this.totalStock > 0 && this.totalStock <= threshold;
};

module.exports = mongoose.model("Product", ProductSchema);