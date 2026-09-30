import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Maximize2, BedDouble, ArrowUpRight, Heart, Scale } from "lucide-react";
import { cn } from "../utils/cn";
import { Container, SectionHeader, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";
import { useCompare } from "../content/CompareContext";

const FALLBACK_IMG =
  "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000";

export default function Showcase() {
  const { content } = useContent();
  const { toggleCompare, isInCompare } = useCompare();
  const s = content.showcase;
  const types = Array.from(new Set((s.properties || []).map((p) => p.type?.trim()).filter(Boolean)));
  const tabs = ["All", ...types];
  const [active, setActive] = useState("All");
  const current = tabs.includes(active) ? active : "All";
  const list = current === "All" ? s.properties : s.properties.filter((p) => p.type?.trim() === current);

  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-ink-900/60 to-transparent" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader align="left" eyebrow={s.eyebrow} title={renderTitle(s.title)} desc={s.description} />
          <div role="tablist" aria-label="Property type" className="glass flex w-fit flex-wrap gap-1 rounded-full p-1">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={current === t}
                onClick={() => setActive(t)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  current === t ? "text-ink-950" : "text-slate-300 hover:text-white"
                )}
              >
                {current === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => {
              const slug = (p.name || `property-${i}`).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `property-${i}`;
              return (
              <motion.li
                layout
                key={(p.name || "prop") + (p.location || "") + i}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-ink-800/60"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.fallback) return;
                      el.dataset.fallback = "1";
                      el.src = FALLBACK_IMG;
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
                  {p.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur border border-white/10">
                      {p.tag}
                    </span>
                  )}
                  <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCompare(p);
                      }}
                      aria-label="Compare property"
                      title={isInCompare(p.name) ? "Remove from comparison" : "Add to comparison"}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur transition-all",
                        isInCompare(p.name)
                          ? "bg-gold-400 text-ink-950 shadow-md shadow-gold-500/30"
                          : "bg-ink-950/70 text-slate-300 hover:bg-gold-400 hover:text-ink-950 border border-white/10"
                      )}
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isInCompare(p.name) ? "Comparing" : "Compare"}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Save property"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-ink-950/70 text-white backdrop-blur border border-white/10 transition hover:bg-rose-500/80 hover:scale-105"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="absolute inset-x-5 bottom-4 flex items-end justify-between">
                    <div>
                      {p.type && <p className="text-xs uppercase tracking-widest text-gold-300">{p.type}</p>}
                      <h3 className="font-display text-xl text-white">{p.name}</h3>
                    </div>
                    {p.price && <p className="text-lg font-semibold text-white">{p.price}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4 text-sm text-slate-400">
                  {p.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gold-400" /> {p.location}
                    </span>
                  )}
                  {p.size && (
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="h-4 w-4 text-gold-400" /> {p.size}
                    </span>
                  )}
                  {p.beds && (
                    <span className="hidden items-center gap-1.5 sm:flex">
                      <BedDouble className="h-4 w-4 text-gold-400" /> {p.beds}
                    </span>
                  )}
                </div>
                <a
                  href={`#/property/${slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View details for ${p.name}`}
                />
                <a
                  href={`#/property/${slug}`}
                  aria-label={`View details for ${p.name}`}
                  title="View Property Details"
                  className="absolute bottom-4 right-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 transition-all duration-300 hover:scale-110 hover:bg-gold-300"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </motion.li>
            );
          })}
          </AnimatePresence>
        </motion.ul>
      </Container>
    </section>
  );
}
