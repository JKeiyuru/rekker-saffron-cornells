import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Seo from "@/components/site/seo";
import { company } from "@/data/site";

const interests = ["Stock our brands", "Become a distributor", "Private label / manufacturing", "Brand partnership", "General enquiry"];

// The shared admin panel (and contact inbox) lives on the shop backend.
const CONTACT_API_BASE =
  import.meta.env.VITE_CONTACT_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://rekker-shop-api.onrender.com";

export default function ContactPage() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", interest: interests[0], message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const base = CONTACT_API_BASE;
      const res = await fetch(`${base}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "corporate",
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          subject: `Rekker enquiry — ${form.interest}`,
          inquiryType: form.interest,
          message: form.message,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Could not send your enquiry.");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", company: "", interest: interests[0], message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message || `Something went wrong. Please email us at ${company.email}.`);
    }
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
            <button
              type="submit"
              disabled={status === "sending"}
              className="sm:col-span-2 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-ink disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : status === "sent" ? "Enquiry sent" : "Send enquiry"}
            </button>
            {status === "sent" && (
              <p className="sm:col-span-2 text-sm text-accent">Thank you — our commercial team will respond within one business day.</p>
            )}
            {status === "error" && (
              <p className="sm:col-span-2 text-sm text-primary">{error}</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
