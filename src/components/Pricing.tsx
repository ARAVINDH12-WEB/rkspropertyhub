import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";
import { Button, Container, SectionHeader, fadeUp, stagger, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

export default function Pricing() {
  const { content } = useContent();
  const pr = content.pricing;
  const [kind, setKind] = useState<"home" | "land">("home");
  const toggles = [
    { key: "home" as const, label: pr.homeToggleLabel },
    { key: "land" as const, label: pr.landToggleLabel },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/6 blur-[150px]" />
      <Container>
        <SectionHeader eyebrow={pr.eyebrow} title={renderTitle(pr.title)} desc={pr.description} />

        <div className="mt-10 flex justify-center">
          <div className="glass relative flex rounded-full p-1" role="tablist" aria-label="Buyer type">
            {toggles.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={kind === t.key}
                onClick={() => setKind(t.key)}
                className={cn(
                  "relative rounded-full px-6 py-2 text-sm font-medium transition-colors",
                  kind === t.key ? "text-ink-950" : "text-slate-300 hover:text-white"
                )}
              >
                {kind === t.key && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {pr.plans.map((p, i) => {
            const price = kind === "land" && p.landPrice ? p.landPrice : p.price;
            const note = kind === "land" && p.landNote ? p.landNote : p.note;
            return (
              <motion.div
                key={p.name + i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={cn(
                  "relative flex flex-col rounded-3xl p-8",
                  p.highlight
                    ? "bg-gradient-to-b from-ink-700 to-ink-900 ring-1 ring-gold-400/50 shadow-[0_30px_80px_-30px_rgba(212,168,81,0.45)] lg:-my-4 lg:py-12"
                    : "glass"
                )}
              >
                {p.highlight && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-950 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" /> {pr.highlightBadge}
                  </span>
                )}
                <h3 className="font-display text-2xl text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-white">{price}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.highlight ? "primary" : "outline"} className="mt-9 w-full" href="#contact">
                  {p.cta}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
        <p className="mt-8 text-center text-sm text-slate-500">{pr.footnote}</p>
      </Container>
    </section>
  );
}
