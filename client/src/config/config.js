// The corporate site reads brands, the home-page spotlight and pop-ups from the
// same API as the shop (managed in the shop's admin console).
// Set VITE_API_BASE_URL in the hosting environment to override the default.
const DEFAULT_API = "https://rekker-shop-site.onrender.com";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API).replace(/\/+$/, "");
