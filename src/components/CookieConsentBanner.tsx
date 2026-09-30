import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, Check, X } from "lucide-react";

export type CookiePreference = "ALL" | "ESSENTIAL_ONLY" | null;

export default function CookieConsentBanner() {
  const [preference, setPreference] = useState<CookiePreference>(() => {
    return (localStorage.getItem("rks_cookie_consent") as CookiePreference) || null;
  });
  const [showDetails, setShowDetails] = useState(false);

  const saveConsent = (choice: "ALL" | "ESSENTIAL_ONLY") => {
    localStorage.setItem("rks_cookie_consent", choice);
    setPreference(choice);

    if (choice === "ESSENTIAL_ONLY") {
      // Disable any non-essential trackers
      (window as any)["ga-disable-analytics"] = true;
    }
  };

  if (preference) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        aria-label="Cookie preferences"
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-ink-950/95 p-5 shadow-2xl shadow-black/80 backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-white">We value your privacy</h3>
            <p className="text-xs leading-relaxed text-slate-300">
              RKS Realty uses essential cookies for secure authentication and state management. We do not sell your personal data. You can choose whether to allow optional analytics to help us improve your property browsing experience. Read our{" "}
              <a href="#/cookies" className="text-gold-300 underline underline-offset-2 hover:text-gold-200">
                Cookie Policy
              </a>{" "}
              and{" "}
              <a href="#/privacy" className="text-gold-300 underline underline-offset-2 hover:text-gold-200">
                Privacy Policy
              </a>
              .
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span><strong>Strictly Necessary:</strong> Session security & CSRF token</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Always Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span><strong>Analytics & Performance:</strong> Anonymous page visit counts</span>
                  <span className="text-[10px] uppercase text-slate-400">Optional</span>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => saveConsent("ALL")}
                className="rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-4 py-2 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent("ESSENTIAL_ONLY")}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 px-2"
              >
                {showDetails ? "Hide Details" : "Customize"}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
