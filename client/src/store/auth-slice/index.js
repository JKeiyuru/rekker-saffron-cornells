// client/src/store/auth-slice/index.js
// Redux slice for authentication — includes forgot and reset password

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/config.js";

const BASE = `${API_BASE_URL}/api/auth`;

// ── Register ──────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk("auth/registerUser", async (formData) => {
  const res = await axios.post(`${BASE}/register`, formData, { withCredentials: true });
  return res.data;
});

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk("auth/loginUser", async (formData) => {
  const res = await axios.post(`${BASE}/login`, formData, { withCredentials: true });
  return res.data;
});

// ── Firebase login ────────────────────────────────────────────────────────────
export const firebaseLoginUser = createAsyncThunk(
  "auth/firebaseLoginUser",
  async ({ idToken, ...body }) => {
    const res = await axios.post(`${BASE}/firebase-login`, body, {
      headers: { Authorization: `Bearer ${idToken}` },
      withCredentials: true,
    });
    return res.data;
  }
);

// ── Social login (Google etc.) ────────────────────────────────────────────────
export const socialLoginUser = createAsyncThunk(
  "auth/socialLoginUser",
  async ({ idToken }) => {
    const res = await axios.post(`${BASE}/social-login`, {}, {
      headers: { Authorization: `Bearer ${idToken}` },
      withCredentials: true,
    });
    return res.data;
  }
);

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const res = await axios.post(`${BASE}/logout`, {}, { withCredentials: true });
  return res.data;
});

// ── Check auth ────────────────────────────────────────────────────────────────
export const checkAuth = createAsyncThunk("auth/checkAuth", async (idToken) => {
  const config = { withCredentials: true };
  if (idToken) config.headers = { Authorization: `Bearer ${idToken}` };
  const res = await axios.get(`${BASE}/check-auth`, config);
  return res.data;
});

// ── Forgot password ───────────────────────────────────────────────────────────
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE}/forgot-password`, { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Request failed" });
    }
  }
);

// ── Reset password ────────────────────────────────────────────────────────────
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE}/reset-password`, { token, newPassword });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Reset failed" });
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  forgotPasswordStatus: "idle",   // idle | loading | success | error
  resetPasswordStatus: "idle",    // idle | loading | success | error
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearPasswordStatus: (state) => {
      state.forgotPasswordStatus = "idle";
      state.resetPasswordStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(registerUser.rejected, (state) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; })

      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; })

      // Firebase login
      .addCase(firebaseLoginUser.pending, (state) => { state.isLoading = true; })
      .addCase(firebaseLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(firebaseLoginUser.rejected, (state) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; })

      // Social login
      .addCase(socialLoginUser.pending, (state) => { state.isLoading = true; })
      .addCase(socialLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(socialLoginUser.rejected, (state) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => { state.isAuthenticated = false; state.user = null; })

      // Check auth
      .addCase(checkAuth.pending, (state) => { state.isLoading = true; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = !!action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => { state.isLoading = false; state.isAuthenticated = false; state.user = null; })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => { state.forgotPasswordStatus = "loading"; })
      .addCase(forgotPassword.fulfilled, (state) => { state.forgotPasswordStatus = "success"; })
      .addCase(forgotPassword.rejected, (state) => { state.forgotPasswordStatus = "error"; })

      // Reset password
      .addCase(resetPassword.pending, (state) => { state.resetPasswordStatus = "loading"; })
      .addCase(resetPassword.fulfilled, (state) => { state.resetPasswordStatus = "success"; })
      .addCase(resetPassword.rejected, (state) => { state.resetPasswordStatus = "error"; });
  },
});

export const { setUser, clearPasswordStatus } = authSlice.actions;
export default authSlice.reducer;