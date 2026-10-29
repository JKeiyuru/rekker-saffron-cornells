import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Handshake, Store, Factory, Globe2 } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import TradeRequestForm from "@/components/site/trade-request-form";
import { CONTENT_API_URL } from "@/config/config.js";

const tracks = [
  { icon: Store, title: "Retailers & Stockists", body: "Stock Saffron Milan, Bio Saff and Cornells with trade pricing, merchandising support and reliable resupply." },
  { icon: Globe2, title: "Regional Distributors", body: "Own a territory with exclusive terms, activation support and priority allocation on new lines." },
  { icon: Factory, title: "Private Label", body: "Use our manufacturing capacity to produce your own branded home care or personal care range." },
  { icon: Handshake, title: "Brand Partnerships", body: "List your brand on the Rekker commerce platform and reach consumers without building your own storefront." },
];

export default function PartnershipsPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#apply") return;
    const t = setTimeout(() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    return () => clearTimeout(t);
  }, [hash]);
  return (
    <>
      <Seo
        title="Partnerships | Stock, Distribute or Manufacture with Rekker"
        description="Partner with Rekker as a retailer, regional distributor, private label client or brand partner on our multi-brand commerce platform."
        path="/partnerships"
      />
      <PageHero
        eyebrow="Work with us"
        title="Four ways to grow with Rekker."
        intro="Whether you sell, distribute, manufacture or own a brand, there is a commercial route into the Rekker network."
      />

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-px bg-border sm:grid-cols-2">
          {tracks.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background p-8">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 border-t bg-muted py-16 md:py-24">
        <div className="container-rk grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="eyebrow">Stockists · Wholesalers · Distributors</span>
            <h2 className="display mt-4 text-3xl md:text-4xl">Apply to stock or distribute Rekker brands.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Tell us who you are, where you are and what you want to order. Each brand has a minimum order quantity, shown as you fill in the form. Our trade team replies within 1–2 working days with pricing and delivery terms.</p>
          </div>
          <TradeRequestForm apiBase={CONTENT_API_URL} source="corporate" square />
        </div>
      </section>

      <section className="border-t bg-ink py-16 text-white md:py-20">
        <div className="container-rk flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="display max-w-xl text-3xl md:text-4xl">Tell us what you want to build with us.</h2>
          <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-white hover:text-ink">
            Start the conversation
          </Link>
        </div>
      </section>
    </>
  );
}
