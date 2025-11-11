const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    console.log("🔄 GET Filtered Products Called");
    console.log("📦 Raw Query Parameters:", req.query);

    // Extract parameters PROPERLY
    const { 
      category, 
      brand, 
      subcategory, 
      sortBy = "price-lowtohigh" 
    } = req.query;

    console.log("🔍 Extracted - Category:", category);
    console.log("🔍 Extracted - Brand:", brand); 
    console.log("🔍 Extracted - Subcategory:", subcategory);

    let filters = {};

    // Handle brand filtering - FIXED
    if (brand && brand !== '[]' && brand !== '') {
      const brandArray = Array.isArray(brand) ? brand : brand.split(",");
      filters.brand = { $in: brandArray };
      console.log("✅ Brand Filter Applied:", brandArray);
    }

    // Handle category filtering - FIXED  
    if (category && category !== '[]' && category !== '') {
      const categoryArray = Array.isArray(category) ? category : category.split(",");
      filters.category = { $in: categoryArray };
      console.log("✅ Category Filter Applied:", categoryArray);
    }

    // Handle subcategory filtering - FIXED (THIS IS THE KEY FIX)
    if (subcategory && subcategory !== '[]' && subcategory !== '') {
      const subcategoryArray = Array.isArray(subcategory) ? subcategory : subcategory.split(",");
      filters.subcategory = { $in: subcategoryArray };
      console.log("✅ Subcategory Filter Applied:", subcategoryArray);
      
      // DEBUG: Test the exact query
      const testQuery = { subcategory: { $in: subcategoryArray } };
      const testResults = await Product.find(testQuery);
      console.log(`🔍 DEBUG: Direct query found ${testResults.length} products`);
    }

    console.log("🎯 Final MongoDB Filters:", JSON.stringify(filters, null, 2));

    // If no filters, show all products
    if (Object.keys(filters).length === 0) {
      console.log("ℹ️  No filters applied - returning all products");
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    console.log("📊 Executing query with filters:", filters);
    const products = await Product.find(filters).sort(sort);
    
    console.log("✅ Query Results:", products.length, "products");
    
    // Final verification
    if (subcategory && products.length > 0) {
      console.log("🔍 Final Check - First product subcategory:", products[0].subcategory);
    }

    res.status(200).json({
      success: true,
      data: products,
      debug: {
        filtersApplied: filters,
        productsCount: products.length
      }
    });
  } catch (error) {
    console.log("❌ Error in getFilteredProducts:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Getting Product Details for ID:", id);
    
    const product = await Product.findById(id);

    if (!product) {
      console.log("❌ Product not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    console.log("✅ Product Found:", product.title);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log("❌ Error in getProductDetails:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };