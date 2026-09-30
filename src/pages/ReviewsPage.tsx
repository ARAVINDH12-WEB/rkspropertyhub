import { Star, MessageSquareQuote, CheckCircle2, ArrowLeft } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";
import { useContent } from "../content/ContentContext";

export default function ReviewsPage() {
  const { content } = useContent();
  const reviews = content.testimonials.items;

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        {/* Header & Rating Snapshot */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow>Client Stories</Eyebrow>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-white">
              Trusted by 2,400+ Families
            </h1>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              98% of our business comes through client referrals. Read real experiences from homeowners, investors, and farmland buyers.
            </p>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/10 flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-white">4.9</p>
              <div className="flex text-gold-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-400 border-l border-white/10 pl-4">
              <p className="font-semibold text-white">Verified Satisfaction</p>
              <p>Based on 340+ verified transaction reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((rev, i) => (
            <div
              key={rev.name + i}
              className="glass relative flex flex-col justify-between rounded-3xl p-8 border border-white/10 hover:border-gold-400/30 transition"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-200 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-display text-base font-semibold text-white">{rev.name}</p>
                  <p className="text-xs text-gold-400">{rev.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
