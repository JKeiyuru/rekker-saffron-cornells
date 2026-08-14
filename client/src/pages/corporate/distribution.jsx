import { Link } from "react-router-dom";
import { Truck, Store, Warehouse, Route } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";

const channels = [
  { icon: Store, title: "Modern & general trade", body: "Supermarkets, minimarkets, dukas and independent retailers stocked through our sales teams." },
  { icon: Warehouse, title: "Wholesale", body: "Volume supply to wholesalers and sub-distributors with agreed trade terms." },
  { icon: Route, title: "Regional distributors", body: "County-level distributor partnerships with territory support and brand activation." },
  { icon: Truck, title: "Direct delivery", body: "Order-to-delivery logistics from Nairobi with a 24-hour turnaround target on stocked lines." },
];

export default function DistributionPage() {
  return (
    <>
      <Seo
        title="Distribution Network | Rekker"
        description="Rekker distributes consumer goods nationwide across Kenya through modern trade, general trade, wholesalers, salons and regional distributors."
        path="/distribution"
      />
      <PageHero
        eyebrow="Capabilities"
        title="Nationwide reach, channel by channel."
        intro="Distribution is where brands are won. Rekker moves product into every channel Kenyan consumers actually buy from."
      />

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-px bg-border sm:grid-cols-2">
          {channels.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background p-8">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted py-16 md:py-24">
        <div className="container-rk grid gap-10 md:grid-cols-2">
          <div>
            <span className="eyebrow">Become a distributor</span>
            <h2 className="display mt-4 text-3xl md:text-4xl">Territory partnerships are open.</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We work with distributors who can hold stock, service a defined territory and grow a
              brand rather than simply resell it. In return you get trade pricing, marketing support
              and first access to new lines.
            </p>
            <Link to="/partnerships" className="mt-8 inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-ink">
              Apply to distribute
            </Link>
          </div>
          <ul className="space-y-4 text-sm">
            {[
              "Defined territory and route planning",
              "Trade pricing and volume incentives",
              "Point-of-sale and activation support",
              "Priority allocation on new launches",
              "Dedicated trade account manager",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 border-b pb-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
