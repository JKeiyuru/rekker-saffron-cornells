// Brand matching + links for the corporate site.
import { SHOP_URL } from "@/data/site";

// "PetCare", "pet-care" and "Pet Care" are the same brand
export const normKey = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const ALIASES = { saffron: "saffronmilan" };
export const anchorId = (key) => ALIASES[normKey(key)] || normKey(key);

// Paths that only exist on the shop (everything else is a corporate page)
const SHOP_ONLY = [/^\/products/, /^\/product\//, /^\/deals/, /^\/wholesale/, /^\/search/, /^\/cart/, /^\/checkout/, /^\/account/];

// Banner/pop-up links are written for the shop (e.g. /products?brand=petcare).
// On the corporate site, shop paths go to the shop; full URLs stay as they are.
export function resolveLink(url) {
  const u = url || "/products";
  if (/^https?:\/\//i.test(u)) return { href: u, external: true };
  if (SHOP_ONLY.some((rx) => rx.test(u))) return { href: `${SHOP_URL}${u}`, external: true };
  return { href: u, external: false };
}

export const shopHref = (brand) => `${SHOP_URL}${brand.shopPath}`;
