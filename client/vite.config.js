import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    viteSitemap({
      hostname: "https://kenyamagictoyshop.com",
      outDir: "dist",
      urls: [
        "/",                  // homepage
        "/shop/home",         // shop home
        "/shop/listing",      // products listing
        "/shop/checkout",     // checkout page
        "/shop/account",      // user account
        "/shop/paypal-return",
        "/shop/payment-success",
        "/shop/search",
        "/unauth-page",       // unauthorized page (optional)
      ],
      exclude: [
        "/auth/*",
        "/admin/*",
      ],
      changefreq: "weekly",
      priority: 0.8,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
