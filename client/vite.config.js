import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    viteSitemap({
      hostname: "https://rekker.co.ke",
      outDir: "dist",
      urls: [
        "/",                          // homepage redirect
        "/shop/home",                 // main homepage
        "/shop/about",                // about page
        "/shop/services",             // services page
        "/shop/distributors",         // distributors page
        "/shop/contact",              // contact page
        "/shop/brands",               // brands overview
        "/shop/brands/saffron",       // Saffron brand page
        "/shop/brands/cornells",      // Cornells brand page
        "/shop/listing",              // products listing
        "/shop/checkout",             // checkout page
        "/shop/account",              // user account
        "/shop/search",               // search page
        "/shop/paypal-return",        // payment return
        "/shop/payment-success",      // payment success
      ],
      exclude: [
        "/auth/*",                    // exclude auth pages
        "/admin/*",                   // exclude admin pages
        "/unauth-page",               // exclude unauth page
      ],
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
      dynamicRoutes: [
        // Add dynamic product routes if needed
        // '/shop/listing?category=stationery',
        // '/shop/listing?brand=saffron',
        // '/shop/listing?brand=cornells',
      ],
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});