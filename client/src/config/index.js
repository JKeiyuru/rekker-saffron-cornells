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

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
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
    componentType: "select",
    options: [
      { id: "home", label: "Home" },
      { id: "under-100", label: "Under 100/" },
      { id: "educational-toys", label: "Educational Toys" },
      { id: "pretend-play", label: "Pretend Play & Role Play" },
      { id: "action-outdoor", label: "Action & Outdoor" },
      { id: "card-board-games", label: "Card & Board Games" },
      { id: "party-supplies", label: "Party Supplies" },
      { id: "stationery-school", label: "Stationery & School" },
      { id: "fashion-accessories", label: "Fashion & Accessories" },
      { id: "home-decor", label: "Home & Decor" },
    ],
  },
 
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
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
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "under-100",
    label: "Under 100/",
    path: "/shop/listing",
  },
  {
    id: "educational-toys",
    label: "Educational Toys",
    path: "/shop/listing",
  },
  {
    id: "pretend-play",
    label: "Pretend Play & Role Play",
    path: "/shop/listing",
  },
  {
    id: "action-outdoor",
    label: "Action & Outdoor",
    path: "/shop/listing",
  },
  {
    id: "card-board-games",
    label: "Card & Board Games",
    path: "/shop/listing",
  },
  {
    id: "party-supplies",
    label: "Party Supplies",
    path: "/shop/listing",
  },
  {
    id: "stationery-school",
    label: "Stationery & School",
    path: "/shop/listing",
  },
  {
    id: "fashion-accessories",
    label: "Fashion & Accessories",
    path: "/shop/listing",
  },
  {
    id: "home-decor",
    label: "Home & Decor",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  home: "Home",
  "under-100": "Under 100/",
  "educational-toys": "Educational Toys",
  "pretend-play": "Pretend Play & Role Play",
  "action-outdoor": "Action & Outdoor",
  "card-board-games": "Card & Board Games",
  "party-supplies": "Party Supplies",
  "stationery-school": "Stationery & School",
  "fashion-accessories": "Fashion & Accessories",
  "home-decor": "Home & Decor",
};



export const filterOptions = {
  category: [
    { id: "home", label: "Home" },
    { id: "under-100", label: "Under 100/" },
    { id: "educational-toys", label: "Educational Toys" },
    { id: "pretend-play", label: "Pretend Play & Role Play" },
    { id: "action-outdoor", label: "Action & Outdoor" },
    { id: "card-board-games", label: "Card & Board Games" },
    { id: "party-supplies", label: "Party Supplies" },
    { id: "stationery-school", label: "Stationery & School" },
    { id: "fashion-accessories", label: "Fashion & Accessories" },
    { id: "home-decor", label: "Home & Decor" },
  ],

};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

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
