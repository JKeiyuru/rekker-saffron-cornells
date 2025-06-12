// client/src/store/auth-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,          // Your custom user data (from MongoDB)
  firebaseUser: null,  // Firebase auth user data
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
      const response = await axios.get(
        "https://nemmoh-ecommerce-server.onrender.com/api/auth/check-auth",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
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
    },
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.firebaseUser = null;
    },
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
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.firebaseUser = null;
      });
  },
});

export const { setUser, setFirebaseUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;