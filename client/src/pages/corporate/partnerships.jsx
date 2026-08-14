import { Link } from "react-router-dom";
import { Handshake, Store, Factory, Globe2 } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";

const tracks = [
  { icon: Store, title: "Retailers & Stockists", body: "Stock Saffron Milan, Bio Saff and Cornells with trade pricing, merchandising support and reliable resupply." },
  { icon: Globe2, title: "Regional Distributors", body: "Own a territory with exclusive terms, activation support and priority allocation on new lines." },
  { icon: Factory, title: "Private Label", body: "Use our manufacturing capacity to produce your own branded home care or personal care range." },
  { icon: Handshake, title: "Brand Partnerships", body: "List your brand on the Rekker commerce platform and reach consumers without building your own storefront." },
];

export default function PartnershipsPage() {
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
