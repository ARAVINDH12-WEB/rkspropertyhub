import { Camera, Briefcase, PlayCircle, MessageCircle, Settings, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Container } from "./ui";
import { Logo } from "./Navbar";
import { useContent } from "../content/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const f = content.footer;
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Helper to map link text to appropriate hash route
  const getLinkHref = (link: string) => {
    const l = link.toLowerCase();
    if (l.includes("plot") || l.includes("farm") || l.includes("villa") || l.includes("apartment") || l.includes("launch") || l.includes("propert")) {
      return "#/properties";
    }
    if (l.includes("about") || l.includes("advisor") || l.includes("team") || l.includes("career")) {
      return "#/about";
    }
    if (l.includes("contact")) {
      return "#/contact";
    }
    if (l.includes("calculator") || l.includes("emi")) {
      return "#/calculator";
    }
    if (l.includes("valuation") || l.includes("sell")) {
      return "#/valuation";
    }
    if (l.includes("blog") || l.includes("report") || l.includes("guide") || l.includes("checklist")) {
      return "#/blog";
    }
    if (l.includes("review") || l.includes("story") || l.includes("stories") || l.includes("press")) {
      return "#/reviews";
    }
    if (l.includes("compare")) {
      return "#/compare";
    }
    return "#top";
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail("");
    }, 4000);
  };

  return (
    <footer className="relative border-t border-white/5 bg-ink-950 pt-16 pb-8">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & About */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{f.about}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gold-400/80">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold-400" />
              <span>RERA Registered & Title-Guaranteed Properties</span>
            </div>
            <div className="mt-6 flex gap-3">
              {[Camera, Briefcase, PlayCircle, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-400 transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {f.columns.map((c, ci) => (
            <nav key={c.title + ci} aria-label={c.title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href={getLinkHref(l)}
                      className="text-sm text-slate-400 transition-colors hover:text-gold-300"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Newsletter / Market Pulse */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{f.newsletterTitle}</h3>
            <p className="mt-5 text-sm text-slate-400">{f.newsletterText}</p>
            {subscribed ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                ✓ You are subscribed to RKS Market Insights!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-4 flex">
                <label htmlFor="nl" className="sr-only">Email</label>
                <input
                  id="nl"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-l-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-xl bg-gold-400 px-4 text-sm font-semibold text-ink-950 transition hover:bg-gold-300"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {f.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#/privacy" className="transition-colors hover:text-gold-300">Privacy Policy</a>
            <a href="#/terms" className="transition-colors hover:text-gold-300">Terms of Service</a>
            <a href="#/cookies" className="transition-colors hover:text-gold-300">Cookie Policy</a>
            <a href="#/fair-housing" className="transition-colors hover:text-gold-300">Fair Housing & RERA</a>
            <a href="#/accessibility" className="transition-colors hover:text-gold-300">Accessibility</a>
            <a
              href="#/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-gold-400/40 hover:text-gold-300"
            >
              <Settings className="h-3.5 w-3.5" /> Admin
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
