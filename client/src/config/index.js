// client/src/config/index.js - Rekker Configuration
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

// Brand Options
export const brandOptions = [
  { id: "rekker", label: "Rekker" },
  { id: "saffron", label: "Saffron" },
  { id: "cornells", label: "Cornells" },
];

// Rekker Categories
export const rekkerCategories = [
  { id: "stationery", label: "Stationery" },
  { id: "bags-suitcases", label: "School Bags & Suitcases" },
  { id: "toys", label: "Toys" },
  { id: "kitchenware", label: "Kitchenware" },
  { id: "padlocks", label: "Padlocks" },
  { id: "stuffed-toys", label: "Teddy Bears & Stuffed Toys" },
  { id: "party-items", label: "Party Items" },
  { id: "educational", label: "Educational Items" },
];

// Saffron Categories & Subcategories
export const saffronCategories = [
  { 
    id: "home-care-hygiene", 
    label: "Home Care & Hygiene",
    subcategories: [
      { id: "dish-wash", label: "Dish Wash" },
      { id: "hand-wash", label: "Hand Wash" },
      { id: "liquid-detergent", label: "Liquid Detergent" },
      { id: "surface-cleaner", label: "Surface Cleaner" },
    ]
  },
  { 
    id: "beauty-body-care", 
    label: "Beauty & Body Care",
    subcategories: [
      { id: "shower-gel", label: "Shower Gel" },
      { id: "body-lotion", label: "Body Lotion" },
      { id: "after-shave", label: "After-Shave" },
      { id: "hair-care", label: "Hair Care Products" },
    ]
  },
];

// Cornells Categories (Collections)
export const cornellsCategories = [
  { 
    id: "super-foods", 
    label: "Super Foods",
    subcategories: [
      { id: "shampoo", label: "Shampoo" },
      { id: "conditioner", label: "Conditioner" },
      { id: "hair-mask", label: "Hair Mask" },
      { id: "hair-serum", label: "Hair Serum" },
      { id: "shower-gel", label: "Shower Gel" },
      { id: "body-lotion", label: "Body Lotion" },
      { id: "body-scrub", label: "Body Scrub" },
      { id: "facial-scrub", label: "Facial Scrub" },
      { id: "facial-mask", label: "Facial Mask" },
      { id: "face-wash", label: "Face Wash" },
      { id: "facial-cream", label: "Facial Cream" },
      { id: "baby-care", label: "Baby Care" },
      { id: "gift-sets", label: "Gift Sets" },
    ]
  },
  { 
    id: "dark-beautiful", 
    label: "Dark & Beautiful",
    subcategories: [
      { id: "shampoo", label: "Shampoo" },
      { id: "conditioner", label: "Conditioner" },
      { id: "styling-products", label: "Styling Products" },
      { id: "hair-treatments", label: "Hair Treatments" },
      { id: "oils-serums", label: "Oils & Serums" },
      { id: "kids-hair-care", label: "Kids Hair Care" },
    ]
  },
  { 
    id: "bold-beautiful", 
    label: "Bold & Beautiful",
    subcategories: [
      { id: "body-cream", label: "Body Cream" },
      { id: "body-lotion", label: "Body Lotion" },
      { id: "shower-gel", label: "Shower Gel" },
      { id: "body-scrub", label: "Body Scrub" },
      { id: "shower-scrub", label: "Shower Scrub" },
      { id: "hand-body-lotion", label: "Hand & Body Lotion" },
      { id: "body-butter", label: "Body Butter" },
      { id: "body-oil", label: "Body Oil" },
      { id: "moisturizer", label: "Moisturizer" },
      { id: "sugar-scrub", label: "Sugar Scrub" },
      { id: "facial-care", label: "Facial Care" },
      { id: "serums", label: "Serums" },
      { id: "deodorant", label: "Anti-Perspirant" },
      { id: "day-night-cream", label: "Day & Night Cream" },
    ]
  },
  { 
    id: "cute-pretty", 
    label: "Cute & Pretty",
    subcategories: [
      { id: "baby-wash-shampoo", label: "Baby Wash & Shampoo" },
      { id: "baby-lotion", label: "Baby Lotion" },
      { id: "baby-oil", label: "Baby Oil" },
      { id: "baby-cream", label: "Baby Cream" },
      { id: "nappy-rash-cream", label: "Nappy Rash Cream" },
      { id: "kids-shampoo", label: "Kids Shampoo" },
      { id: "kids-conditioner", label: "Kids Conditioner" },
      { id: "kids-styling", label: "Kids Styling Products" },
      { id: "kids-treatments", label: "Kids Hair Treatments" },
    ]
  },
];

// Get categories based on brand
export const getCategoriesByBrand = (brand) => {
  switch(brand) {
    case "rekker":
      return rekkerCategories;
    case "saffron":
      return saffronCategories;
    case "cornells":
      return cornellsCategories;
    default:
      return [];
  }
};

// Get subcategories based on brand and category
export const getSubcategories = (brand, category) => {
  if (brand === "rekker") return [];
  
  const categories = brand === "saffron" ? saffronCategories : cornellsCategories;
  const foundCategory = categories.find(cat => cat.id === category);
  return foundCategory?.subcategories || [];
};

// Add Product Form Elements
export const addProductFormElements = [
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: brandOptions,
    required: true,
  },
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select-dynamic",
    options: [], // Will be populated based on brand selection
    required: true,
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select-dynamic",
    options: [], // Will be populated based on category selection
    showWhen: ["saffron", "cornells"], // Only show for these brands
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price (KES)",
    required: true,
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
    required: true,
  },
];

// Shopping View Header Menu Items
export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "about",
    label: "About",
    path: "/shop/about",
  },
  {
    id: "services",
    label: "Services",
    path: "/shop/services",
  },
  {
    id: "distributors",
    label: "Distributors",
    path: "/shop/distributors",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
];

// Category Options Map (for display)
export const categoryOptionsMap = {
  // Rekker
  "stationery": "Stationery",
  "bags-suitcases": "School Bags & Suitcases",
  "toys": "Toys",
  "kitchenware": "Kitchenware",
  "padlocks": "Padlocks",
  "stuffed-toys": "Teddy Bears & Stuffed Toys",
  "party-items": "Party Items",
  "educational": "Educational Items",
  
  // Saffron
  "home-care-hygiene": "Home Care & Hygiene",
  "beauty-body-care": "Beauty & Body Care",
  
  // Cornells
  "super-foods": "Super Foods",
  "dark-beautiful": "Dark & Beautiful",
  "bold-beautiful": "Bold & Beautiful",
  "cute-pretty": "Cute & Pretty",
};

// Subcategory Options Map
export const subcategoryOptionsMap = {
  // Saffron - Home Care
  "dish-wash": "Dish Wash",
  "hand-wash": "Hand Wash",
  "liquid-detergent": "Liquid Detergent",
  "surface-cleaner": "Surface Cleaner",
  
  // Saffron - Beauty & Body
  "shower-gel": "Shower Gel",
  "body-lotion": "Body Lotion",
  "after-shave": "After-Shave",
  "hair-care": "Hair Care Products",
  
  // Cornells - Super Foods
  "shampoo": "Shampoo",
  "conditioner": "Conditioner",
  "hair-mask": "Hair Mask",
  "hair-serum": "Hair Serum",
  "body-scrub": "Body Scrub",
  "facial-scrub": "Facial Scrub",
  "facial-mask": "Facial Mask",
  "face-wash": "Face Wash",
  "facial-cream": "Facial Cream",
  "baby-care": "Baby Care",
  "gift-sets": "Gift Sets",
  
  // Cornells - Dark & Beautiful
  "styling-products": "Styling Products",
  "hair-treatments": "Hair Treatments",
  "oils-serums": "Oils & Serums",
  "kids-hair-care": "Kids Hair Care",
  
  // Cornells - Bold & Beautiful
  "body-cream": "Body Cream",
  "shower-scrub": "Shower Scrub",
  "hand-body-lotion": "Hand & Body Lotion",
  "body-butter": "Body Butter",
  "body-oil": "Body Oil",
  "moisturizer": "Moisturizer",
  "sugar-scrub": "Sugar Scrub",
  "facial-care": "Facial Care",
  "serums": "Serums",
  "deodorant": "Anti-Perspirant",
  "day-night-cream": "Day & Night Cream",
  
  // Cornells - Cute & Pretty
  "baby-wash-shampoo": "Baby Wash & Shampoo",
  "baby-lotion": "Baby Lotion",
  "baby-oil": "Baby Oil",
  "baby-cream": "Baby Cream",
  "nappy-rash-cream": "Nappy Rash Cream",
  "kids-shampoo": "Kids Shampoo",
  "kids-conditioner": "Kids Conditioner",
  "kids-styling": "Kids Styling Products",
  "kids-treatments": "Kids Hair Treatments",
};

// Brand Display Map
export const brandOptionsMap = {
  "rekker": "Rekker",
  "saffron": "Saffron",
  "cornells": "Cornells",
};

// Filter Options
export const filterOptions = {
  brand: brandOptions,
  category: [
    // Rekker Categories
    ...rekkerCategories,
    // Saffron Categories
    ...saffronCategories.map(cat => ({ id: cat.id, label: cat.label })),
    // Cornells Categories
    ...cornellsCategories.map(cat => ({ id: cat.id, label: cat.label })),
  ],
  subcategory: [
    // All Saffron Subcategories
    ...saffronCategories.flatMap(cat => cat.subcategories),
    // All Cornells Subcategories
    ...cornellsCategories.flatMap(cat => cat.subcategories),
  ].filter((subcat, index, self) => 
    index === self.findIndex((s) => s.id === subcat.id)
  ), // Remove duplicates
};

// Sort Options
export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

// Address Form Controls
export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

// Helper function to get full product category display
export const getProductCategoryDisplay = (brand, category, subcategory) => {
  let display = brandOptionsMap[brand] || brand;
  
  if (category) {
    display += ` - ${categoryOptionsMap[category] || category}`;
  }
  
  if (subcategory) {
    display += ` - ${subcategoryOptionsMap[subcategory] || subcategory}`;
  }
  
  return display;
};