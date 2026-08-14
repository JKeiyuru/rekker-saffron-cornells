import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Seo from "@/components/site/seo";
import { brands, SHOP_URL } from "@/data/site";

export default function BrandDetail() {
  const { slug } = useParams();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    return (
      <div className="container-rk py-32 text-center">
        <h1 className="display text-3xl">Brand not found</h1>
        <Link to="/brands" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
          <ArrowLeft className="h-4 w-4" /> All brands
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${brand.name} | ${brand.category} by Rekker`}
        description={brand.tagline}
        path={`/brands/${brand.slug}`}
      />

      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img
          src={brand.image}
          alt={brand.name}
          width={1200}
          height={1500}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="container-rk relative py-24 md:py-32">
          <Link to="/brands" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/60 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Our brands
          </Link>
          <span className="eyebrow mt-8 block">{brand.category}</span>
          <h1 className="display mt-3 text-4xl md:text-6xl">{brand.name}</h1>
          <p className="mt-5 max-w-2xl text-base text-white/70 md:text-lg">{brand.tagline}</p>
          <a
            href={`${SHOP_URL}${brand.shopPath}`}
            className="mt-9 inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-white hover:text-ink"
          >
            Shop the {brand.name} collection <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="eyebrow">Brand story</span>
            <p className="mt-5 text-lg leading-relaxed">{brand.story}</p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {brand.name} is manufactured and/or distributed by Rekker Limited. Retailers, salons,
              wholesalers and distributors can stock the range directly through our trade team.
            </p>
            <Link
              to="/partnerships"
              className="mt-8 inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-white"
            >
              Stock {brand.name}
            </Link>
          </div>
          <aside className="border bg-muted p-8">
            <h2 className="font-display text-lg font-bold">Range highlights</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {brand.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
