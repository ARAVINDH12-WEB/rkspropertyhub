import { motion } from "framer-motion";
import { Search, ClipboardCheck, Handshake, Key } from "lucide-react";
import { Container, SectionHeader, Reveal, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

const icons = [Search, ClipboardCheck, Handshake, Key];

export default function Benefits() {
  const { content } = useContent();
  const p = content.process;
  return (
    <section id="benefits" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute -right-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-gold-500/8 blur-[130px] animate-float" />
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeader align="left" eyebrow={p.eyebrow} title={renderTitle(p.title)} desc={p.description} />
            <ol className="relative mt-12 space-y-8">
              <span aria-hidden className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-gold-400/60 via-white/10 to-transparent" />
              {p.steps.map(({ title, desc }, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <Reveal as="li" key={title + i} delay={i * 0.1} className="relative flex gap-6">
                    <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold-500/30 bg-ink-900 text-gold-300 shadow-lg shadow-gold-500/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.25em] text-gold-400">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>

          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
              <motion.img
                src={p.image}
                alt="Aerial view of farmland and homes"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback) return;
                  el.dataset.fallback = "1";
                  el.src =
                    "https://images.pexels.com/photos/16588337/pexels-photo-16588337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800";
                }}
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full bg-ink-800 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="glass absolute inset-x-6 bottom-6 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-300">{p.statLabel}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="font-display text-4xl text-white">{p.statValue}</p>
                  <p className="max-w-[140px] text-right text-sm text-slate-300">{p.statNote}</p>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, Math.max(0, p.statPercent))}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-600"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">{p.statCaption}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
              className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-[2rem] border border-gold-500/20"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
