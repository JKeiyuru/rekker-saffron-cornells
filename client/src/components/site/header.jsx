import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { nav, SHOP_URL } from "@/data/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ink text-white">
        <div className="container-rk flex h-9 items-center justify-between text-[11px] uppercase tracking-[0.18em]">
          <span className="hidden sm:inline text-white/60">One company. Multiple brands.</span>
          <a
            href={SHOP_URL}
            className="inline-flex items-center gap-1.5 font-bold text-white hover:text-primary"
          >
            Shop our brands <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_1px_20px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="container-rk flex h-[68px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="/Logo.jpg" alt="Rekker" width={36} height={36} className="h-9 w-9 object-cover" />
            <span className="font-display text-xl font-bold tracking-tight">REKKER</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SHOP_URL}
              className="hidden items-center gap-2 bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-ink sm:inline-flex"
            >
              Shop Now <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t bg-background lg:hidden">
            <nav className="container-rk flex flex-col py-2">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="border-b py-3.5 text-sm font-medium last:border-0"
                >
                  {item.label}
                </NavLink>
              ))}
              <a href={SHOP_URL} className="mt-3 mb-4 bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground">
                Shop Our Brands
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
