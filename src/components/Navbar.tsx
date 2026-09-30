import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, SlidersHorizontal, User, Calculator, Home, Info, PhoneCall, Scale } from "lucide-react";
import { cn } from "../utils/cn";
import { Container } from "./ui";
import { useContent } from "../content/ContentContext";

export function Logo() {
  const { content } = useContent();
  return (
    <a href="#/" className="flex items-center gap-2.5" aria-label={`${content.brand.name} ${content.brand.accentName} home`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 shadow-lg shadow-gold-500/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-950" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9h13v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      </span>
      <span className="font-display text-xl tracking-wide text-white">
        {content.brand.name} <span className="text-gold-400">{content.brand.accentName}</span>
      </span>
    </a>
  );
}

interface NavbarProps {
  onOpenAuth?: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    setUserToken(localStorage.getItem("rks_token") || localStorage.getItem("rks_admin_token"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Primary navigation links across the app
  const primaryLinks = [
    { label: "Properties", href: "#/properties", icon: Home },
    { label: "Compare", href: "#/compare", icon: Scale },
    { label: "About", href: "#/about", icon: Info },
    { label: "EMI Calculator", href: "#/calculator", icon: Calculator },
    { label: "Valuation", href: "#/valuation", icon: ArrowUpRight },
    { label: "Contact", href: "#/contact", icon: PhoneCall },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <Container>
        <div
          className={cn(
            "mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6",
            scrolled ? "glass shadow-2xl shadow-black/40" : "border border-transparent"
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                className="relative rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-gold-400 after:transition-all after:duration-300 hover:after:w-6"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${content.brand.phone.replace(/\s/g, "")}`}
              className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              {content.brand.phone}
            </a>

            {/* Client Portal / Sign In */}
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10 hover:border-gold-400/40"
              title="Client Portal / Sign In"
            >
              <User className="h-3.5 w-3.5 text-gold-400" />
              <span>{userToken ? "Account" : "Sign In"}</span>
            </button>

            {/* Quick Consultation CTA */}
            <a
              href="#/contact"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-500/30"
            >
              {content.brand.navCtaLabel}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-xl text-white transition hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <Container>
              <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 shadow-2xl">
                {primaryLinks.map((l, i) => (
                  <motion.a
                    key={l.href + l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white"
                  >
                    {l.icon && <l.icon className="h-4 w-4 text-gold-400" />}
                    <span>{l.label}</span>
                  </motion.a>
                ))}

                <hr className="my-2 border-white/10" />

                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenAuth?.();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <User className="h-4 w-4 text-gold-400" />
                  <span>Client Portal / Sign In</span>
                </button>

                <a
                  href="#/contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-4 py-3 text-center text-sm font-semibold text-ink-950"
                >
                  {content.hero.primaryCta}
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
