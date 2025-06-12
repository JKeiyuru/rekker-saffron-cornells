// server/controllers/auth/auth-controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register (Traditional method)
const registerUser = async (req, res) => {
  const { userName, email, password, firebaseUid } = req.body;

  try {
    // Check if user exists by email or Firebase UID
    const existingUser = await User.findOne({ 
      $or: [{ email }, ...(firebaseUid ? [{ firebaseUid }] : [])] 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    // Validate required fields
    if (!userName || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required",
      });
    }

    // For traditional registration, password is required
    if (!firebaseUid && !password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const newUser = new User({
      userName,
      email,
      ...(password && { password: await bcrypt.hash(password, 12) }),
      ...(firebaseUid && { firebaseUid, provider: 'firebase' }),
    });

    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        userName: newUser.userName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login (Traditional method)
const loginUser = async (req, res) => {
  const { email, password, firebaseUid } = req.body;

  try {
    // Find user by email or Firebase UID
    const user = await User.findOne({
      $or: [{ email }, ...(firebaseUid ? [{ firebaseUid }] : [])],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check your email or register first.",
      });
    }

    // Verify password if not using Firebase auth
    if (!firebaseUid) {
      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "This account was created with Google. Please use Google sign-in.",
        });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password. Please try again.",
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// Enhanced Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Check Firebase token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const admin = require("firebase-admin");
        const idToken = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (user) {
          req.user = {
            id: user._id,
            role: user.role,
            email: user.email,
            userName: user.userName,
          };
          return next();
        }
      } catch (firebaseError) {
        console.log("Firebase token verification failed, trying JWT...");
      }
    }

    // Fallback to JWT token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
    
    // Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    };
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Authentication token expired. Please login again.",
      });
    }
    
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };