import { motion, type Variants } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { cn } from "../utils/cn";

/** Renders a title string where *wrapped words* become gold gradient text. */
export function renderTitle(title: string): ReactNode {
  const parts = title.split("*");
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-gradient-gold">
        {p}
      </span>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    )
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "p" | "h2" | "h3";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-4xl leading-[1.1] text-white sm:text-5xl">{title}</h2>
      {desc && <p className="mt-5 text-lg leading-relaxed text-slate-400">{desc}</p>}
    </Reveal>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  href = "#contact",
  size = "md",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  href?: string;
  size?: "md" | "lg";
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 will-change-transform focus-visible:outline-gold-400";
  const sizes = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-sm";
  const variants = {
    primary:
      "bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 text-ink-950 shadow-[0_10px_40px_-10px_rgba(212,168,81,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(212,168,81,0.75)] hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-slate-200 hover:text-white hover:bg-white/5",
    outline:
      "glass text-white hover:border-white/20 hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",
  };
  return (
    <a href={href} className={cn(base, sizes, variants[variant], className)}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[150%]" />
        </span>
      )}
      <span className="relative">{children}</span>
    </a>
  );
}
