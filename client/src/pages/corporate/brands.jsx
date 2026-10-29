import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import useBrands from "@/hooks/use-brands";
import { anchorId, shopHref } from "@/lib/brand-utils";

export default function BrandsPage() {
  const { brands, loaded } = useBrands();
  const { hash, search } = useLocation();
  // direct links: /brands#petcare or /brands?brand=petcare scroll to that brand
  const wanted = (new URLSearchParams(search).get("brand") || hash.replace(/^#/, "")).trim();
  useEffect(() => {
    if (!wanted) return;
    const el = document.getElementById(anchorId(wanted));
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    return () => clearTimeout(t);
  }, [wanted, loaded, brands.length]);
  return (
    <>
      <Seo
        title="Our Brands | Rekker"
        description="Saffron Milan for home and cleaning, Bio Saff for beauty and personal care, Cornells for fragrance, PetCare for pets — the consumer brands owned and distributed by Rekker."
        path="/brands"
      />
      <PageHero
        eyebrow="Brand Architecture"
        title="One platform. Multiple brands. One customer experience."
        intro="Every Rekker brand keeps its own identity, audience and product logic — while sharing our manufacturing, distribution and commerce infrastructure."
      />

      <nav aria-label="Jump to a brand" className="sticky top-[68px] z-30 border-b bg-background/95 backdrop-blur">
        <div className="container-rk flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-[11px] font-bold uppercase tracking-[0.14em]">
          <span className="text-muted-foreground">Jump to</span>
          {brands.map((b) => (
            <a key={b.slug} href={`#${anchorId(b.slug)}`} className="hover:text-primary">{b.name}</a>
          ))}
        </div>
      </nav>

      <section className="py-16 md:py-24">
        <div className="container-rk space-y-20">
          {brands.map((b, i) => (
            <article key={b.slug} id={anchorId(b.slug)} className="grid scroll-mt-36 items-center gap-10 md:grid-cols-2">
              <div className={i % 2 ? "md:order-2" : ""}>
                <img
                  src={b.image}
                  alt={`${b.name} products`}
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className={`h-[420px] w-full ${b.imageFit === "contain" ? "border bg-white object-contain p-8" : "object-cover"}`}
                />
              </div>
              <div>
                <span className="eyebrow">{b.isNew ? "New brand · " : ""}{b.category}</span>
                <h2 className="display mt-4 text-3xl md:text-4xl">{b.name}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{b.story}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {b.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={shopHref(b)}
                    className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-ink"
                  >
                    Shop {b.name} products <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link to={`/brands/${b.slug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] hover:text-primary">
                    Brand information <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
