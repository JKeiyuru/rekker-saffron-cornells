// server/controllers/admin/products-controller.js
const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// Upload image to Cloudinary
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.json({
      success: false,
      message: "Error occurred during image upload",
    });
  }
};

//Add a new product
const addProduct = async (req, res) => {
  try {
    console.log("=== ADD PRODUCT REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
      variations
    } = req.body;

    // Validate required fields
    if (!title || !category || price === undefined || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, price, and totalStock are required",
      });
    }

    // Initialize parsedVariations as an empty array at the beginning
    let parsedVariations = [];
    
    // Parse variations if it exists
    if (variations) {
      try {
        // Handle both stringified JSON and direct array
        if (typeof variations === 'string') {
          parsedVariations = JSON.parse(variations);
        } else if (Array.isArray(variations)) {
          parsedVariations = variations;
        } else {
          // If variations is not a string or array, set to empty array
          parsedVariations = [];
        }
        
        // Validate variations structure if we have any
        if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
          for (let i = 0; i < parsedVariations.length; i++) {
            const variation = parsedVariations[i];
            if (!variation.image || !variation.label) {
              return res.status(400).json({
                success: false,
                message: `Variation ${i + 1} is missing image or label`,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse variations:", err);
        return res.status(400).json({
          success: false,
          message: "Invalid variations format. Must be a valid JSON array.",
        });
      }
    }

    // Validate that product has either main image or variations
    if (!image && (!parsedVariations || parsedVariations.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Product must have either a main image or at least one variation",
      });
    }

    const productData = {
      image: image || null,
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category.trim(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      totalStock: Number(totalStock),
      averageReview: averageReview ? Number(averageReview) : 0,
      variations: parsedVariations || []
    };

    console.log("Creating product with data:", {
      ...productData,
      variations: productData.variations.map(v => ({
        label: v.label,
        hasImage: !!v.image
      }))
    });

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    console.log("Product saved successfully:", {
      id: savedProduct._id,
      variationsCount: savedProduct.variations.length
    });

    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
      error: error.message,
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== EDIT PRODUCT REQUEST ===");
    console.log("Product ID:", id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
      variations
    } = req.body;

    // Validate required fields
    if (!title || !category || price === undefined || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, price, and totalStock are required",
      });
    }

    // Initialize parsedVariations as an empty array at the beginning
    let parsedVariations = [];
    
    // Parse variations if it exists
    if (variations) {
      try {
        if (typeof variations === "string") {
          parsedVariations = JSON.parse(variations);
        } else if (Array.isArray(variations)) {
          parsedVariations = variations;
        } else {
          // If variations is not a string or array, set to empty array
          parsedVariations = [];
        }
      } catch (err) {
        console.error("Failed to parse variations:", err);
        return res.status(400).json({
          success: false,
          message: "Invalid variations format. Must be a valid JSON array.",
        });
      }
    }

    // Validate variations structure
    if (parsedVariations && parsedVariations.length > 0) {
      for (let i = 0; i < parsedVariations.length; i++) {
        const variation = parsedVariations[i];
        if (!variation.image || !variation.label) {
          return res.status(400).json({
            success: false,
            message: `Variation ${i + 1} is missing image or label`,
          });
        }
      }
    }

    // Validate that product has either main image or variations
    if (!image && (!parsedVariations || parsedVariations.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Product must have either a main image or at least one variation",
      });
    }

    const updateData = {
      image: image || null,
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category.trim(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      totalStock: Number(totalStock),
      averageReview: averageReview ? Number(averageReview) : 0,
      variations: parsedVariations || []
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product updated successfully:", {
      id: updatedProduct._id,
      variationsCount: updatedProduct.variations.length
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while editing product",
      error: error.message,
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting product",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};