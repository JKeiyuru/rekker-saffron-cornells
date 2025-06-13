// client/src/store/auth-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

const initialState = {
  isAuthenticated: false,
  isLoading: false, // Changed to false initially
  user: null,          // Your custom user data (from MongoDB)
  firebaseUser: null,  // Firebase auth user data
  authChecked: false,  // New flag to track if auth has been checked
};

// Register with Firebase + Backend
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ formData, firebaseUid }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://nemmoh-ecommerce-server.onrender.com/api/auth/register",
        { ...formData, firebaseUid },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Login with Firebase + Backend
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData, firebaseUid }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://nemmoh-ecommerce-server.onrender.com/api/auth/login",
        { ...formData, firebaseUid },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Logout from both Firebase and Backend
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      const response = await axios.post(
        "https://nemmoh-ecommerce-server.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Verify auth status with Firebase token
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (firebaseToken, { rejectWithValue }) => {
    try {
      const headers = {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      };
      
      // Add Authorization header if Firebase token is provided
      if (firebaseToken) {
        headers.Authorization = `Bearer ${firebaseToken}`;
      }

      const response = await axios.get(
        "https://nemmoh-ecommerce-server.onrender.com/api/auth/check-auth",
        {
          withCredentials: true,
          headers,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.authChecked = true;
    },
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.firebaseUser = null;
      state.authChecked = true;
      state.isLoading = false;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.firebaseUser = null;
        state.isLoading = false;
        state.authChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, setFirebaseUser, clearAuth, setAuthChecked, setLoading } = authSlice.actions;
export default authSlice.reducer;