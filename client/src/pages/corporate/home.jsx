import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Factory, Truck, Sparkles, ShoppingBag } from "lucide-react";
import Seo from "@/components/site/seo";
import { brands, capabilities, stats, SHOP_URL } from "@/data/site";

const icons = [Factory, Sparkles, Truck, ShoppingBag];

export default function CorporateHome() {
  return (
    <>
      <Seo
        title="Rekker | Manufacturing & Distribution of Kenya's Everyday Brands"
        description="Rekker manufactures and distributes trusted consumer brands across Kenya — Saffron Milan, Bio Saff and Cornells. Partner with us or shop our brands online."
        path="/"
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img
          src="/images/hero-rekker.jpg"
          alt="Rekker distribution warehouse in Kenya"
          width={1920}
          height={1080}
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="container-rk relative py-24 md:py-36">
          <span className="eyebrow rk-in">Rekker Limited — Nairobi, Kenya</span>
          <h1 className="display mt-5 max-w-4xl text-4xl sm:text-6xl md:text-7xl rk-in">
            We build, make and move the brands Kenya
            <span className="text-primary"> uses every day.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg rk-in">
            Rekker is a consumer goods company: manufacturing, brand development and nationwide
            distribution — now with a dedicated online shopping platform for our brands.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row rk-in">
            <a
              href={SHOP_URL}
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-white hover:text-ink"
            >
              Shop our brands <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/partnerships"
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              Partner with Rekker <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-background">
        <div className="container-rk grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-9 first:pl-0 md:first:pl-0">
              <div className="font-display text-3xl font-bold md:text-4xl">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 md:py-28">
        <div className="container-rk">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Our Brands</span>
              <h2 className="display mt-4 text-3xl md:text-5xl">One company. Distinct identities.</h2>
            </div>
            <Link to="/brands" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] hover:text-primary">
              All brands <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {brands.map((b) => (
              <article key={b.slug} className="group border bg-background">
                <div className="relative overflow-hidden bg-ink">
                  <img
                    src={b.image}
                    alt={`${b.name} — ${b.category}`}
                    loading="lazy"
                    width={1200}
                    height={1500}
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                    {b.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold">{b.name}</h3>
                  <p className="mt-3 min-h-[64px] text-sm leading-relaxed text-muted-foreground">{b.tagline}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <a
                      href={`${SHOP_URL}${b.shopPath}`}
                      className="inline-flex items-center gap-1.5 bg-ink px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary"
                    >
                      Shop {b.name} <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <Link to={`/brands/${b.slug}`} className="text-[11px] font-bold uppercase tracking-[0.14em] hover:text-primary">
                      Learn more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y bg-muted py-20 md:py-28">
        <div className="container-rk">
          <span className="eyebrow">What we do</span>
          <h2 className="display mt-4 max-w-2xl text-3xl md:text-5xl">
            From formulation to the final shelf.
          </h2>
          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
            {capabilities.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={c.title} className="bg-background p-8">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-5 font-display text-xl font-bold">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-rk flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="display text-3xl md:text-4xl">Looking to buy our products?</h2>
            <p className="mt-3 max-w-xl text-sm text-primary-foreground/80 md:text-base">
              Consumer shopping now lives on shop.rekker.co.ke — one cart across every Rekker brand,
              M-Pesa checkout and countrywide delivery.
            </p>
          </div>
          <a
            href={SHOP_URL}
            className="inline-flex shrink-0 items-center gap-2 bg-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-background hover:text-ink"
          >
            Go to the shop <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
