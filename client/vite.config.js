import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // ✅ Proxy API requests to your backend
      "/api": {
        target: "http://localhost:5000", // Replace with your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
