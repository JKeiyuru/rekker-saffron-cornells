import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import { brands, SHOP_URL } from "@/data/site";

export default function BrandsPage() {
  return (
    <>
      <Seo
        title="Our Brands | Rekker"
        description="Saffron Milan for home and cleaning, Bio Saff for beauty and personal care, Cornells for fragrance — the consumer brands owned and distributed by Rekker."
        path="/brands"
      />
      <PageHero
        eyebrow="Brand Architecture"
        title="One platform. Multiple brands. One customer experience."
        intro="Every Rekker brand keeps its own identity, audience and product logic — while sharing our manufacturing, distribution and commerce infrastructure."
      />

      <section className="py-16 md:py-24">
        <div className="container-rk space-y-16">
          {brands.map((b, i) => (
            <article key={b.slug} className="grid items-center gap-10 md:grid-cols-2">
              <div className={i % 2 ? "md:order-2" : ""}>
                <img
                  src={b.image}
                  alt={`${b.name} products`}
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow">{b.category}</span>
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
                    href={`${SHOP_URL}${b.shopPath}`}
                    className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-ink"
                  >
                    Shop {b.name} <ArrowUpRight className="h-4 w-4" />
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
