// Legacy setting (the old backend at api.rekker.co.ke). Nothing on the corporate
// site's public pages uses it any more.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// Brands, the home-page spotlight, pop-ups and trade requests come from the SHOP
// backend (managed in the shop admin console). This deliberately does NOT reuse
// VITE_API_BASE_URL, which on the corporate host points at the older backend that
// has none of these routes (that gave the 404s). Override with VITE_SHOP_API_URL.
const DEFAULT_SHOP_API = "https://rekker-shop-site.onrender.com";
export const CONTENT_API_URL = (import.meta.env.VITE_SHOP_API_URL || DEFAULT_SHOP_API).replace(/\/+$/, "");
