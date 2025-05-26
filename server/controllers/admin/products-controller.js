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
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred during image upload",
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    console.log("==========================");
    console.log("=== ADD PRODUCT REQUEST ===");
    console.log("Full request body:", JSON.stringify(req.body, null, 2));
    console.log("==========================");

    // In products-controller.js addProduct function
console.log("Raw variations received:", req.body.variations);
console.log("Type of variations:", typeof req.body.variations);
console.log("Parsed variations:", parsedVariations);

    let parsedVariations = [];
    if (typeof req.body.variations === "string") {
      try {
        parsedVariations = JSON.parse(req.body.variations);
      } catch (err) {
        console.error("Failed to parse variations JSON string:", err);
        return res.status(400).json({
          success: false,
          message: "Invalid variations format. Must be a JSON array.",
        });
      }
    } else {
      parsedVariations = req.body.variations || [];
    }

    // In addProduct controller, add this validation:
if (!productData.image && (!parsedVariations || parsedVariations.length === 0)) {
  return res.status(400).json({
    success: false,
    message: "Product must have either a main image or at least one variation",
  });
}

    const {
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    if (!title || !category || !price || !totalStock) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, price, and totalStock are required",
      });
    }

    // Validate each variation
    for (let i = 0; i < parsedVariations.length; i++) {
      const variation = parsedVariations[i];
      if (!variation.image || !variation.label) {
        return res.status(400).json({
          success: false,
          message: `Variation ${i + 1} is missing image or label`,
        });
      }
    }

    const productData = {
      image: image || null,
      title,
      description: description || "",
      category,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      totalStock: Number(totalStock),
      averageReview: averageReview ? Number(averageReview) : 0,
      variations: parsedVariations,
    };



   // Right before saving, add:
console.log("Final product data before save:", {
  ...productData,
  variations: productData.variations.map(v => ({
    label: v.label,
    image: v.image?.substring(0, 25) + "..."
  }))
});

const newlyCreatedProduct = new Product(productData);
await newlyCreatedProduct.save();

console.log("Saved product:", {
  _id: newlyCreatedProduct._id,
  variations: newlyCreatedProduct.variations
});

    console.log("Product created successfully:", newlyCreatedProduct);

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.error("Add Product Error:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
      error: e.message,
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
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
    console.log("Full request body:", JSON.stringify(req.body, null, 2));
    console.log("==========================");

    let parsedVariations = [];
    if (typeof req.body.variations === "string") {
      try {
        parsedVariations = JSON.parse(req.body.variations);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Failed to parse variations. Must be valid JSON array.",
        });
      }
    } else {
      parsedVariations = req.body.variations || [];
    }

    const {
      image,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    if (!title || !category || price === undefined || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, price, and totalStock are required",
      });
    }

    // Validate each variation
    for (let i = 0; i < parsedVariations.length; i++) {
      const variation = parsedVariations[i];
      if (!variation.image || !variation.label) {
        return res.status(400).json({
          success: false,
          message: `Variation ${i + 1} is missing image or label`,
        });
      }
    }

    const updateData = {
      image: image || null,
      title,
      description: description || "",
      category,
      price: Number(price) || 0,
      salePrice: salePrice ? Number(salePrice) : 0,
      totalStock: Number(totalStock) || 0,
      averageReview: averageReview ? Number(averageReview) : 0,
      variations: parsedVariations,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product updated successfully:", updatedProduct);

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (e) {
    console.error("Edit Product Error:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while editing product",
      error: e.message,
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
  } catch (e) {
    console.log(e);
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
