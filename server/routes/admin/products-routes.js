// server/routes/admin/products-routes.js
const express = require("express");
const router = express.Router();
const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct
} = require("../../controllers/admin/products-controller");
const { upload } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// Existing routes
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

// NEW TEST ROUTE
router.post("/test-variations", async (req, res) => {
  try {
    console.log("Test route hit"); // Add this for verification
    
    const testProduct = new Product({
      title: "TEST VARIATIONS PRODUCT",
      price: 100,
      category: "test",
      totalStock: 10,
      variations: [{
        image: "https://test.com/image.jpg", 
        label: "Test Variation"
      }]
    });

    const saved = await testProduct.save();
    const fromDb = await Product.findById(saved._id);

    res.json({
      success: true,
      saved: saved.variations,
      fromDb: fromDb.variations,
      match: JSON.stringify(saved.variations) === JSON.stringify(fromDb.variations)
    });
  } catch (e) {
    console.error("Test route error:", e);
    res.status(500).json({
      success: false,
      message: "Test failed",
      error: e.message
    });
  }
});

module.exports = router;