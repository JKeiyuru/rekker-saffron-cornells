import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSitemap from "vite-plugin-sitemap";
import compression from "vite-plugin-compression";
import fs from 'fs';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: ['@babel/plugin-syntax-dynamic-import'],
      },
    }),
    {
      name: 'copy-robots-txt',
      closeBundle: () => {
        // Copy robots.txt from public folder to dist folder after build
        const robotsSrc = path.resolve(__dirname, 'public', 'robots.txt');
        const robotsDest = path.resolve(__dirname, 'dist', 'robots.txt');
        
        try {
          if (fs.existsSync(robotsSrc)) {
            fs.copyFileSync(robotsSrc, robotsDest);
            console.log('✅ robots.txt copied from public folder to dist folder');
          } else {
            console.warn('⚠️ robots.txt not found in public folder');
          }
        } catch (error) {
          console.error('❌ Error copying robots.txt:', error);
        }
      }
    },
    viteSitemap({
      hostname: "https://rekker.co.ke",
      generateRobotsTxt: false, // Disable automatic robots.txt generation
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
      dynamicRoutes: [],
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'redux': [
            '@reduxjs/toolkit',
            'react-redux',
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            'lucide-react',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    sourcemap: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'firebase/app',
      'firebase/auth',
    ],
    exclude: ['@vite/client'],
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});