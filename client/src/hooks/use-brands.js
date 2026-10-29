// The corporate site's brand list.
//
// The hand-written entries in data/site.js (images, long copy) are the fallback
// and keep the site working if the API is unreachable. On top of that we read
// the live brand list from the shop API (Admin → Brands), so:
//   • any brand added in the admin console appears on the brands pages automatically
//   • "Spotlight on home hero" and the "New" badge are controlled from the admin
//   • "Shop <brand>" always uses the real brand slug for the products filter
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/config.js";
import { brands as staticBrands } from "@/data/site";
import { anchorId } from "@/lib/brand-utils";

const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || "") && v !== "#000000";

function mergeBrands(api) {
  const used = new Set();
  const out = staticBrands.map((s) => {
    const a = api.find((b) => anchorId(b.slug) === anchorId(s.slug) || anchorId(b.name) === anchorId(s.slug));
    if (!a) return { ...s, source: "static" };
    used.add(a._id);
    return {
      ...s,
      name: a.name || s.name,
      category: a.category || s.category,
      tagline: s.tagline || a.tagline,
      // static artwork/copy is curated for the original brands; admin-uploaded art wins for the rest
      image: s.imageFit === "contain" && a.logoUrl ? a.logoUrl : s.image,
      banner: s.banner && a.bannerUrl ? a.bannerUrl : s.banner,
      highlights: a.highlights?.length ? a.highlights : s.highlights,
      shopPath: `/products?brand=${a.slug}`,
      sortOrder: a.sortOrder,
      isFeatured: !!a.isFeatured,
      isNew: !!a.showNewBadge,
      source: "api",
    };
  });
  api.filter((a) => !used.has(a._id)).forEach((a) => {
    out.push({
      slug: a.slug,
      name: a.name,
      category: a.category || "Brand",
      color: "primary",
      image: a.logoUrl || a.bannerUrl || "/images/hero-rekker.jpg",
      imageFit: a.logoUrl ? "contain" : "cover",
      banner: a.bannerUrl || null,
      tagline: a.tagline || a.description || "",
      story: a.story || a.description || a.tagline || "",
      highlights: a.highlights || [],
      shopPath: `/products?brand=${a.slug}`,
      themeColor: isHex(a.themeColor) ? a.themeColor : null,
      sortOrder: a.sortOrder,
      isFeatured: !!a.isFeatured,
      isNew: !!a.showNewBadge,
      source: "api",
    });
  });
  // spotlight brand first, otherwise keep the order: hand-written brands, then new admin brands by sort order
  return out.sort((x, y) => (y.isFeatured ? 1 : 0) - (x.isFeatured ? 1 : 0));
}

let cache = null; // { api: [] | null }
let inflight = null;

function load() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = axios
      .get(`${API_BASE_URL}/api/shop/brands`, { timeout: 8000 })
      .then(({ data }) => (cache = { api: data.data || [], ok: true }))
      .catch(() => (cache = { api: [], ok: false }))
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export default function useBrands() {
  const [state, setState] = useState(cache);
  useEffect(() => {
    let alive = true;
    load().then((c) => { if (alive) setState(c); });
    return () => { alive = false; };
  }, []);

  const loaded = !!state;
  const brands = mergeBrands(state?.api || []);
  // while loading (or if the API is down) fall back to the static flags
  const featured = brands.find((b) => b.isFeatured) || null;
  return { brands, featured, loaded };
}
