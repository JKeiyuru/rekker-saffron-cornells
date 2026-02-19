// server/server.js
// Main Express server entry point

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Firebase Admin Initialization
const admin = require("firebase-admin");
if (!admin.apps.length) {
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
  console.log("Firebase Config Check:", {
    hasProjectId: !!firebaseConfig.projectId,
    hasPrivateKey: !!firebaseConfig.privateKey,
    hasClientEmail: !!firebaseConfig.clientEmail,
    projectId: firebaseConfig.projectId,
  });
  if (firebaseConfig.projectId && firebaseConfig.privateKey && firebaseConfig.clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
    });
    console.log("Firebase Admin initialized successfully");
  } else {
    console.warn("Firebase environment variables not found. Skipping Firebase initialization.");
  }
}

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminDeliveryLocationsRouter = require("./routes/admin/delivery-locations-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopDeliveryRouter = require("./routes/shop/delivery-routes");
const wishlistRouter = require("./routes/shop/wishlist-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const mpesaRouter = require("./routes/shop/mpesa-routes");

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cache-Control"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Allow popup windows to be closed
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);

// Admin
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/delivery-locations", adminDeliveryLocationsRouter);

// Shop
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/delivery", shopDeliveryRouter);
app.use("/api/shop", mpesaRouter);

// Wishlist & Common
app.use("/api/wishlist", wishlistRouter);
app.use("/api/common/feature", commonFeatureRouter);

// Health Check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
);