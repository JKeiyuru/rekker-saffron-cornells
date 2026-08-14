import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import { company } from "@/data/site";

const interests = ["Stock our brands", "Become a distributor", "Private label / manufacturing", "Brand partnership", "General enquiry"];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", interest: interests[0], message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function onSubmit(e) {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\nInterest: ${form.interest}\n\n${form.message}`
    );
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Rekker enquiry — ${form.interest}`)}&body=${body}`;
    setSent(true);
  }

  const field = "w-full border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <>
      <Seo
        title="Contact Rekker | Trade, Distribution & Manufacturing Enquiries"
        description="Get in touch with Rekker Limited in Nairobi for stocking, distribution, private label manufacturing and brand partnership enquiries."
        path="/contact"
      />
      <PageHero eyebrow="Contact" title="Let's talk trade." intro="Our commercial team responds to trade enquiries within one business day." />

      <section className="py-16 md:py-24">
        <div className="container-rk grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <div>
              <h2 className="eyebrow">Head office</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" />{company.phone}</li>
                <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" />{company.email}</li>
                <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" />{company.address}</li>
              </ul>
            </div>
            <div className="border bg-muted p-6 text-sm leading-relaxed text-muted-foreground">
              Looking to buy products as a consumer? Orders, payment and delivery are handled on our
              shop platform at shop.rekker.co.ke.
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <input required className={field} placeholder="Full name" value={form.name} onChange={set("name")} />
            <input required type="email" className={field} placeholder="Email address" value={form.email} onChange={set("email")} />
            <input className={field} placeholder="Phone number" value={form.phone} onChange={set("phone")} />
            <input className={field} placeholder="Company / business" value={form.company} onChange={set("company")} />
            <select className={`${field} sm:col-span-2`} value={form.interest} onChange={set("interest")}>
              {interests.map((i) => <option key={i}>{i}</option>)}
            </select>
            <textarea required rows={6} className={`${field} sm:col-span-2`} placeholder="How can we help?" value={form.message} onChange={set("message")} />
            <button type="submit" className="sm:col-span-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-ink">
              {sent ? "Opening your email client…" : "Send enquiry"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
