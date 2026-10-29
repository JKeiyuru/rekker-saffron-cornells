/* eslint-disable react/prop-types */
// The featured brand card in the home-page hero. Which brand it is — and whether
// it shows at all — is set in the shop admin console (Brands → "Spotlight on the
// home page hero").
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { shopHref } from "@/lib/brand-utils";

export default function BrandSpotlight({ brand }) {
  if (!brand) return null;
  return (
    <aside className="rk-in overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm">
      <div className="relative bg-white">
        <img
          src={brand.banner || brand.image}
          alt={`${brand.name} — ${brand.tagline}`}
          width={1600}
          height={600}
          className={`w-full ${brand.banner ? "aspect-[8/3] object-cover" : "aspect-[4/3] object-contain p-4"}`}
        />
        {brand.isNew && (
          <span className="absolute left-0 top-0 bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
            New brand
          </span>
        )}
      </div>
      <div className="p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{brand.category}</span>
        <h2 className="display mt-2 text-2xl md:text-3xl">{brand.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{brand.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={shopHref(brand)}
            className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-white hover:text-ink"
          >
            Shop {brand.name} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link to={`/brands/${brand.slug}`} className="text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:text-primary">
            Meet the brand
          </Link>
        </div>
      </div>
    </aside>
  );
}
