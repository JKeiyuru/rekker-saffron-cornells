import { Link } from "react-router-dom";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import { stats } from "@/data/site";

const timeline = [
  { title: "Built on trade", body: "Rekker started by moving fast-moving consumer goods through Kenya's general and modern trade channels." },
  { title: "Into manufacturing", body: "We moved upstream into local production of home care and personal care lines, controlling quality and cost." },
  { title: "Brand ownership", body: "Saffron Milan and Bio Saff were developed in-house; Cornells is distributed nationwide by Rekker." },
  { title: "Consumer commerce", body: "shop.rekker.co.ke turns Rekker into a direct-to-consumer business alongside its trade channels." },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Rekker | Consumer Goods Manufacturing & Distribution in Kenya"
        description="Who Rekker is: a Kenyan consumer goods company building, manufacturing and distributing household, beauty and fragrance brands nationwide."
        path="/about"
      />
      <PageHero
        eyebrow="Company"
        title="A Kenyan consumer goods company built for scale."
        intro="Rekker develops, manufactures and distributes consumer brands — and now sells them directly to consumers through its own commerce platform."
      />

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-12 md:grid-cols-2">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="display mt-4 text-3xl md:text-4xl">Products people actually reach for.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Rekker Limited operates across the full consumer goods chain: formulation and
              manufacturing, brand development, sales and nationwide distribution.
            </p>
            <p>
              Our portfolio covers home and cleaning care, beauty and personal care, and fragrance.
              Each brand is run with its own identity and commercial logic, supported by shared
              infrastructure that lets us launch new lines quickly.
            </p>
            <p>
              Our objective is straightforward: build brands that hold their own on the shelf and
              online, and make them available everywhere Kenyan consumers shop.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted py-16 md:py-24">
        <div className="container-rk">
          <span className="eyebrow">Our journey</span>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-4">
            {timeline.map((t, i) => (
              <div key={t.title} className="bg-muted p-7">
                <div className="font-display text-4xl font-bold text-primary/25">0{i + 1}</div>
                <h3 className="mt-4 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-rk grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl font-bold">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="container-rk mt-14">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-ink px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary">
            Talk to our team
          </Link>
        </div>
      </section>
    </>
  );
}
