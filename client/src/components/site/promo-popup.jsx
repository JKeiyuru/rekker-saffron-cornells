// Centre-screen pop-up, managed in the shop admin console (Ads & Banners → Pop-up
// → "Show on: Corporate site"). Content, layout, delay, frequency and the
// optional discount code all come from there.
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Check, Copy, X } from "lucide-react";
import { CONTENT_API_URL as API_BASE_URL } from "@/config/config.js";
import { resolveLink } from "@/lib/brand-utils";

const FREQ_MS = { day: 864e5, week: 6048e5 };
const shownThisLoad = new Set();
let cache = null;

const store = (freq) => { try { return freq === "session" ? window.sessionStorage : window.localStorage; } catch { return null; } };
// updatedAt is part of the key: editing a pop-up in the admin shows it again
const keyOf = (b) => `rk_popup_${b._id}_${new Date(b.updatedAt || 0).getTime()}`;

function due(b) {
  if (b.popupFrequency === "always") return true;
  const st = store(b.popupFrequency);
  if (!st) return true;
  try {
    const last = Number(st.getItem(keyOf(b)) || 0);
    if (!last) return true;
    if (b.popupFrequency === "session") return false;
    return Date.now() - last > (FREQ_MS[b.popupFrequency] || FREQ_MS.day);
  } catch { return true; }
}
function markSeen(b) { try { store(b.popupFrequency)?.setItem(keyOf(b), String(Date.now())); } catch { /* private mode */ } }
const track = (id, event) => { try { axios.post(`${API_BASE_URL}/api/shop/banners/${id}/${event}`).catch(() => {}); } catch { /* ignore */ } };

// the shop reads ?promo=CODE and pre-fills it at checkout
function withCode(href, code) {
  if (!code || !/^https?:\/\//i.test(href)) return href;
  try { const u = new URL(href); u.searchParams.set("promo", code); return u.toString(); } catch { return href; }
}

export default function PromoPopup() {
  const { pathname } = useLocation();
  const [banners, setBanners] = useState(cache || []);
  const [active, setActive] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    axios.get(`${API_BASE_URL}/api/shop/banners`, { params: { placement: "popup", site: "corporate" }, timeout: 8000 })
      .then(({ data }) => { cache = data.data || []; if (alive) setBanners(cache); })
      .catch(() => { cache = []; });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (active) return;
    const next = banners.find((b) => !shownThisLoad.has(b._id) && (b.popupPages === "all" || pathname === "/") && due(b));
    if (!next) return;
    const t = setTimeout(() => {
      shownThisLoad.add(next._id);
      markSeen(next);
      setActive(next);
      track(next._id, "view");
    }, Math.max(0, Number(next.popupDelay ?? 3)) * 1000);
    return () => clearTimeout(t);
  }, [banners, pathname, active]);

  const close = useCallback(() => { setActive(null); setCopied(false); }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [active, close]);

  if (!active) return null;
  const b = active;
  const { href: base } = resolveLink(b.linkUrl || (b.brandSlug ? `/products?brand=${b.brandSlug}` : "/products"));
  const href = withCode(base, b.couponCode);
  const isImage = b.popupLayout === "image" && b.imageUrl;
  const onCta = () => { track(b._id, "click"); close(); };

  async function copy() {
    try { await navigator.clipboard.writeText(b.couponCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  }

  const codeBox = b.couponCode && (
    <button type="button" onClick={copy} aria-label={`Copy discount code ${b.couponCode}`} className="flex w-full items-center gap-3 border-2 border-dashed border-current px-4 py-2.5 text-left">
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Your code</span>
        <span className="block font-mono text-xl font-bold tracking-[0.18em]">{b.couponCode}</span>
      </span>
      <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
        {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
      </span>
    </button>
  );

  const cta = (cls) => (
    <a href={href} onClick={onCta} className={`inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${cls}`}>
      {b.ctaLabel || "Shop now"}
    </a>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-label={b.title} className={`rk-in relative w-full overflow-hidden bg-white shadow-2xl ${isImage ? "max-w-2xl" : "max-w-md"}`}>
        <button type="button" aria-label="Close" onClick={close} autoFocus className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center bg-ink/80 text-white transition-colors hover:bg-primary">
          <X className="h-4 w-4" />
        </button>

        {isImage ? (
          <>
            <a href={href} onClick={onCta} className="block"><img src={b.imageUrl} alt={b.title} className="block h-auto w-full" /></a>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              {codeBox ? <div className="sm:max-w-[55%] sm:flex-1">{codeBox}</div> : <p className="text-sm text-muted-foreground">{b.subtitle}</p>}
              {cta("bg-primary text-primary-foreground hover:bg-ink")}
            </div>
          </>
        ) : (
          <>
            {b.imageUrl && <img src={b.imageUrl} alt="" className="block aspect-[16/8] w-full object-cover" />}
            <div className="space-y-4 p-6 text-center sm:p-8" style={{ background: b.bgColor, color: b.textColor }}>
              {b.badge && <span className="inline-block bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">{b.badge}</span>}
              <h2 className="display text-2xl sm:text-3xl">{b.title}</h2>
              {b.subtitle && <p className="text-sm opacity-90 sm:text-base">{b.subtitle}</p>}
              {codeBox && <div className="mx-auto max-w-xs">{codeBox}</div>}
              {cta("w-full bg-white text-ink hover:bg-primary hover:text-primary-foreground sm:w-auto")}
            </div>
          </>
        )}
        <button type="button" onClick={close} className="block w-full pb-3 text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink">No thanks</button>
      </div>
    </div>
  );
}
