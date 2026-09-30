import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Container, Reveal } from "./ui";
import { useContent } from "../content/ContentContext";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function SocialProof() {
  const { content } = useContent();
  const { stats, partnersTitle, partners } = content.socialProof;
  return (
    <section aria-label="Social proof" className="relative border-y border-white/5 bg-ink-900/60 py-14">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label + i} className="text-center lg:text-left">
                <dd className="font-display text-4xl text-white sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-sm text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
      <div className="relative mt-12 overflow-hidden" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-900 to-transparent" />
        <p className="mb-5 text-center text-xs uppercase tracking-[0.25em] text-slate-500">{partnersTitle}</p>
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="font-display text-xl text-slate-500 transition-colors hover:text-slate-200">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
