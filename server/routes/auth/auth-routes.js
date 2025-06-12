const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Firebase Admin Middleware
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Authorization token required" 
      });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please login again." 
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: "Invalid authentication token" 
    });
  }
};

// Traditional Registration Route (without Firebase)
router.post("/register", registerUser);

// Traditional Login Route (without Firebase)
router.post("/login", loginUser);

// Firebase Registration Route
router.post("/firebase-register", verifyFirebaseToken, async (req, res) => {
  try {
    const { userName, email, firebaseUid } = req.body;
    const { uid, email: firebaseEmail } = req.firebaseUser;
    
    // Ensure the Firebase UID matches
    if (firebaseUid !== uid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Firebase token"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: firebaseEmail }, { firebaseUid: uid }] 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists!"
      });
    }

    // Create new user
    const newUser = new User({
      userName,
      email: firebaseEmail, // Use email from Firebase token
      firebaseUid: uid,
      provider: 'firebase'
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
    console.error("Firebase registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Firebase Login Route
router.post("/firebase-login", verifyFirebaseToken, async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;
    const { uid, email: firebaseEmail } = req.firebaseUser;
    
    // Find user by Firebase UID or email
    const user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email: firebaseEmail }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user with Firebase UID if not already set
    if (!user.firebaseUid) {
      user.firebaseUid = uid;
      user.provider = 'firebase';
      await user.save();
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
    console.error("Firebase login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Social Login Route (Google)
router.post("/social-login", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;

    // Find or create user
    let user = await User.findOne({ 
      $or: [{ email }, { firebaseUid: uid }] 
    });

    if (!user) {
      // Create new user
      user = new User({
        userName: name || email.split('@')[0],
        email,
        firebaseUid: uid,
        provider: 'google',
        role: 'user'
      });
      await user.save();
    } else if (!user.firebaseUid) {
      // Update existing user with Firebase UID
      user.firebaseUid = uid;
      user.provider = 'google';
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: '7d' }
    );

    // Set cookies and respond
    res.cookie('token', jwtToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName
      }
    });

  } catch (error) {
    console.error('Social login error:', error);
    
    const errorMessage = error.code === 'auth/id-token-expired' 
      ? 'Login session expired. Please try again.'
      : 'Authentication failed. Please try another method.';

    res.status(401).json({
      success: false,
      message: errorMessage
    });
  }
});

// Logout Route
router.post("/logout", logoutUser);

// Authentication Check Route - Modified to work with both auth methods
router.get("/check-auth", async (req, res) => {
  try {
    // Try Firebase token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const idToken = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (user) {
          return res.status(200).json({
            success: true,
            user: {
              id: user._id,
              role: user.role,
              email: user.email,
              userName: user.userName
            }
          });
        }
      } catch (firebaseError) {
        console.log("Firebase token invalid, trying JWT...");
      }
    }

    // Fallback to JWT token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token found"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
    
    // Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid authentication token" 
    });
  }
});

module.exports = router;