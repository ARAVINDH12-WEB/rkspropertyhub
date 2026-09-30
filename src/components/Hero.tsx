import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, MapPin, TrendingUp, Star, ArrowUpRight } from "lucide-react";
import { Button, Container, Eyebrow, fadeUp, stagger, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

const bulletIcons = [ShieldCheck, MapPin, TrendingUp];

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.08]);

  return (
    <section id="top" className="noise relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      {/* ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[140px] animate-float-slow" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-amber-700/10 blur-[120px] animate-float" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-900/20 blur-[140px]" />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <motion.div variants={stagger} initial="hidden" animate="show" className="lg:col-span-6">
            <motion.div variants={fadeUp}>
              <Eyebrow>{hero.badge}</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl"
            >
              {renderTitle(hero.title)}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              {hero.description}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" href="#contact">
                {hero.primaryCta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" href="#showcase">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-400/20 text-gold-300">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
                {hero.secondaryCta}
              </Button>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
              {hero.bullets.map((text, i) => {
                const Icon = bulletIcons[i % bulletIcons.length];
                return (
                  <li key={text + i} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gold-400" /> {text}
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/60 sm:aspect-[5/4] lg:aspect-[4/5]">
              <motion.img
                src={hero.image}
                alt={hero.featuredName}
                style={{ y, scale }}
                className="h-full w-full bg-ink-800 object-cover"
                loading="eager"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback) return;
                  el.dataset.fallback = "1";
                  el.src =
                    "https://images.pexels.com/photos/4933643/pexels-photo-4933643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />

              {/* Clickable link to property details */}
              <a
                href={`#/property/${encodeURIComponent(hero.featuredName.toLowerCase().replace(/\s+/g, "-"))}`}
                className="absolute inset-0 z-10"
                aria-label={`View full details for ${hero.featuredName}`}
              />

              {/* bottom caption */}
              <div className="absolute inset-x-5 bottom-5 z-20 flex items-end justify-between pointer-events-none">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-300">{hero.featuredLabel}</p>
                  <p className="mt-1 font-display text-2xl text-white">{hero.featuredName}</p>
                  <p className="text-sm text-slate-300">{hero.featuredDetails}</p>
                </div>
                <div className="glass rounded-2xl px-4 py-2.5 text-right flex items-center gap-3">
                  <div>
                    <p className="text-xs text-slate-400">{hero.featuredPriceLabel}</p>
                    <p className="font-semibold text-white">{hero.featuredPrice}</p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-400 text-ink-950 transition hover:bg-gold-300 shadow-md">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -left-4 top-10 hidden rounded-2xl p-4 shadow-xl sm:block lg:-left-10"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{hero.growthLabel}</p>
                  <p className="font-semibold text-white">{hero.growthValue}</p>
                </div>
              </div>
              <div className="mt-3 flex h-8 items-end gap-1">
                {[35, 50, 42, 65, 58, 80, 72, 95].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.07, duration: 0.6 }}
                    className="w-2 rounded-sm bg-gradient-to-t from-gold-600 to-gold-300"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass absolute -right-3 bottom-28 hidden rounded-2xl p-4 shadow-xl sm:block lg:-right-8"
            >
              <div className="flex items-center gap-1 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1 text-xs font-semibold text-white">{hero.ratingValue}</span>
              </div>
              <p className="mt-2 max-w-[180px] text-sm text-slate-200">{hero.ratingQuote}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-300 to-amber-400" />
                <p className="text-xs text-slate-400">{hero.ratingAuthor}</p>
              </div>
            </motion.div>

            <div className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-400 animate-pulse-ring" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-400" />
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
