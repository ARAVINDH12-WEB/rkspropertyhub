import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "../utils/cn";
import { Container, SectionHeader, Reveal, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

export default function FAQ() {
  const { content } = useContent();
  const faq = content.faq;
  const phone = content.brand.phone;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeader align="left" eyebrow={faq.eyebrow} title={renderTitle(faq.title)} desc={faq.description} />
            <Reveal delay={0.2} className="mt-8">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-lg font-semibold text-white underline decoration-gold-400/50 underline-offset-4 hover:decoration-gold-400"
              >
                {phone}
              </a>
              <p className="mt-1 text-sm text-slate-500">{faq.hours}</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-3">
            <ul className="divide-y divide-white/8 rounded-3xl border border-white/8 bg-ink-900/40">
              {faq.items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q + i}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.03] sm:px-8"
                    >
                      <span className={cn("text-base font-medium sm:text-lg", isOpen ? "text-white" : "text-slate-200")}>
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen ? "rotate-45 border-gold-400 bg-gold-400 text-ink-950" : "border-white/15 text-slate-300"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 leading-relaxed text-slate-400 sm:px-8">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
