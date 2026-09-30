import { Cookie, ArrowLeft, RefreshCw } from "lucide-react";
import { Container } from "../../components/ui";

export default function CookiePolicy() {
  const resetConsent = () => {
    localStorage.removeItem("rks_cookie_consent");
    location.reload();
  };

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
              <Cookie className="h-3.5 w-3.5" /> Tracking & Transparency
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white">Cookie Policy</h1>
            <p className="mt-2 text-xs text-slate-400">Clear disclosure of cookies and web tokens used on RKS Realty</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files placed on your device when you visit our website. They help us ensure platform security, maintain your authenticated session, and understand how visitors interact with our property listings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-white">2. Categories of Cookies We Use</h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Strictly Necessary Cookies (Always Active)</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Essential for secure authentication, CSRF cross-site request forgery prevention (`rks_csrf_token`), and session refresh tokens (`rks_refresh_token`). These cookies do not store personally identifiable data and cannot be disabled.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Performance & Functional Preferences (Optional)</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Remembers your property search filter preferences (such as plot vs. villa selection or price range) and customized page themes to give you a smoother experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-white">3. Resetting Your Cookie Preferences</h2>
              <p>
                You can reset or change your cookie choices at any time. Clicking the button below will clear your saved consent preference and redisplay the banner on your next action:
              </p>
              <button
                onClick={resetConsent}
                className="inline-flex items-center gap-2 rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-400 hover:text-ink-950"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Cookie Consent
              </button>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
