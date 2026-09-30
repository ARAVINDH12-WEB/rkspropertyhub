import { Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Container } from "../../components/ui";

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-20 text-slate-300">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-8 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        <div className="max-w-3xl space-y-8 glass rounded-3xl p-8 sm:p-12 border border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 border border-gold-400/25 px-3 py-1 text-xs font-bold text-gold-300 mb-3">
              <Eye className="h-3.5 w-3.5" /> Digital Inclusion
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white">Accessibility Statement</h1>
            <p className="mt-2 text-xs text-slate-400">Aiming for WCAG 2.1 Level AA conformance on all public pages</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Our Accessibility Standard</h2>
              <p>
                RKS Realty is dedicated to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards defined by the Web Content Accessibility Guidelines (WCAG 2.1) Level AA.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-white">Implemented Measures</h2>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Keyboard Navigation:</strong> All interactive elements, property cards, tabs, and form fields are reachable via standard Tab and Enter keys with clear focus outlines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Color Contrast:</strong> Text colors against background palettes meet or exceed the 4.5:1 minimum contrast ratio for readability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Screen Reader Friendly:</strong> Images contain descriptive alt attributes, and modals implement proper ARIA roles and trap focus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Responsive Zoom:</strong> The layout scales fluidly up to 200% zoom without truncation or overlap.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Accessibility Feedback</h2>
              <p>
                If you encounter any accessibility barrier on our website, please email our web accessibility coordinator at:
              </p>
              <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-gold-300">
                accessibility@rksrealty.in · Response turnaround: 1 business day
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
