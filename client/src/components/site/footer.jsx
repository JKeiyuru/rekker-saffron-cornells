import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { brands, company, nav, SHOP_URL } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-rk py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold">REKKER</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {company.tagline} Manufacturing, brand building and nationwide distribution from Nairobi.
            </p>
            <a
              href={SHOP_URL}
              className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-white hover:text-ink"
            >
              Shop our brands <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Our Brands</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link to={`/brands/${b.slug}`} className="hover:text-primary">{b.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{company.phone}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{company.email}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{company.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {company.legal}. All rights reserved.</span>
          <span>Consumer shopping: <a href={SHOP_URL} className="text-white/70 hover:text-primary">shop.rekker.co.ke</a></span>
        </div>
      </div>
    </footer>
  );
}
