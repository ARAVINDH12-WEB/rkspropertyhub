import { Home, ArrowLeft, HeartHandshake } from "lucide-react";
import { Container } from "../../components/ui";

export default function FairHousing() {
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
              <HeartHandshake className="h-3.5 w-3.5" /> Equal Opportunity
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white">Fair Housing & Equal Opportunity</h1>
            <p className="mt-2 text-xs text-slate-400">Our commitment to inclusive, ethical property ownership</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Equal Housing Opportunity Statement</h2>
              <p>
                RKS Realty Pvt. Ltd. is pledged to the letter and spirit of equal housing opportunity throughout India and internationally for all global NRI buyers. We encourage and support an affirmative real estate environment in which there are no barriers to obtaining housing or land.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Non-Discrimination Policy</h2>
              <p>
                We strictly conduct all advisory, site visits, property transactions, negotiations, and mortgage assistance without regard to race, color, religion, sex, disability, familial status, national origin, caste, or sexual orientation. Every client receives identical transparency, access to verified land titles, and dedicated buying support.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Reporting Concerns</h2>
              <p>
                If you believe you have experienced differential treatment or have feedback regarding accessibility and fair opportunity on our platform, please notify our ethics officer directly at <strong className="text-gold-300">ethics@rksrealty.in</strong>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
