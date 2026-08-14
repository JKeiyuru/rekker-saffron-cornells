import { Link } from "react-router-dom";
import { Beaker, PackageCheck, ShieldCheck, Boxes } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";

const services = [
  { icon: Beaker, title: "Formulation & R&D", body: "Product development for home care and personal care, tuned for local water, climate and usage habits." },
  { icon: Boxes, title: "Production & Filling", body: "Batch production, filling, capping and labelling across multiple pack sizes and formats." },
  { icon: ShieldCheck, title: "Quality Control", body: "Batch-level checks and documentation, with compliance to Kenyan standards for consumer goods." },
  { icon: PackageCheck, title: "Private Label", body: "Contract manufacturing and private label production for retailers and partner brands." },
];

export default function ManufacturingPage() {
  return (
    <>
      <Seo
        title="Manufacturing Capabilities | Rekker"
        description="Rekker's manufacturing capability: formulation, production, filling, quality control and private label for home care and personal care products in Kenya."
        path="/manufacturing"
      />
      <PageHero
        eyebrow="Capabilities"
        title="Manufacturing that controls quality, cost and speed."
        intro="We produce locally so our brands can move fast on formulation, pack size and price without waiting on import cycles."
      />

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-px bg-border sm:grid-cols-2">
          {services.map(({ icon: Icon, title, body }) => (
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
          <div>
            <h2 className="display text-3xl md:text-4xl">Need a product manufactured?</h2>
            <p className="mt-3 max-w-xl text-sm text-white/60 md:text-base">
              We take on private label and contract manufacturing for partners with serious volume.
            </p>
          </div>
          <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-white hover:text-ink">
            Request a quote
          </Link>
        </div>
      </section>
    </>
  );
}
