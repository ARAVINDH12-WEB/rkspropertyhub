import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { Container, Reveal, Eyebrow, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-gold-400/60 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-gold-400/20";

export default function CTA() {
  const { content } = useContent();
  const c = content.contact;
  const brand = content.brand;
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.currentTarget;
      const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
      const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value;
      const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
      const type = (form.elements.namedItem("type") as HTMLSelectElement)?.value;
      const budget = (form.elements.namedItem("budget") as HTMLSelectElement)?.value;
      const msg = (form.elements.namedItem("msg") as HTMLTextAreaElement)?.value;

      await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || `${phone.replace(/\D/g, "")}@rksrealty-lead.com`,
          message: msg || `Interested in ${type || "Properties"} with budget ${budget || "Not specified"}`,
          interestedIn: type,
          budgetRange: budget,
        }),
      });
      setSent(true);
    } catch (err) {
      console.error("Failed to post lead:", err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="noise relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950 p-8 sm:p-12 lg:p-16">
            <div aria-hidden className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/20 blur-[110px] animate-float-slow" />
            <div aria-hidden className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-amber-600/10 blur-[110px] animate-float" />
            <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <h2 className="mt-5 font-display text-4xl leading-[1.08] text-white sm:text-5xl">
                  {renderTitle(c.title)}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-400">{c.description}</p>
                <ul className="mt-8 space-y-4 text-slate-300">
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gold-400" /> {brand.phone}
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gold-400" /> {brand.email}
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gold-400" /> {brand.address}
                  </li>
                </ul>
              </div>

              <div className="glass rounded-3xl p-6 sm:p-8">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-gold-400" />
                    </motion.div>
                    <h3 className="mt-5 font-display text-2xl text-white">{c.successTitle}</h3>
                    <p className="mt-2 text-slate-400">{c.successText}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="space-y-4" aria-label="Book a consultation">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="sr-only">Full name</label>
                        <input id="name" name="name" required placeholder="Full name" className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="phone" className="sr-only">Phone</label>
                        <input id="phone" name="phone" required type="tel" placeholder="Phone number" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <input id="email" name="email" type="email" placeholder="Email (optional)" className={inputCls} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="type" className="sr-only">Looking for</label>
                        <select id="type" name="type" className={inputCls + " appearance-none"} defaultValue="">
                          <option value="" disabled>Looking for…</option>
                          {c.lookingForOptions.map((o) => (
                            <option key={o} value={o} className="bg-ink-900">{o}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="budget" className="sr-only">Budget</label>
                        <select id="budget" name="budget" className={inputCls + " appearance-none"} defaultValue="">
                          <option value="" disabled>Budget range…</option>
                          {c.budgetOptions.map((o) => (
                            <option key={o} value={o} className="bg-ink-900">{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="msg" className="sr-only">Message</label>
                      <textarea id="msg" name="msg" rows={3} placeholder="Preferred locations or anything we should know" className={inputCls + " resize-none"} />
                    </div>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 px-6 py-3.5 font-semibold text-ink-950 shadow-lg shadow-gold-500/30 transition-shadow hover:shadow-xl hover:shadow-gold-500/40 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : c.submitLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                    <p className="text-center text-xs text-slate-500">{c.privacyNote}</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
