const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

// Add debug middleware to log all requests
router.use((req, res, next) => {
  console.log("🛣️ Products Route Hit:", req.method, req.originalUrl);
  console.log("📋 Query Parameters:", req.query);
  next();
});

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;