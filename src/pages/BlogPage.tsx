import { BookOpen, Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";

const POSTS = [
  {
    slug: "42-point-legal-audit-checklist",
    title: "The 42-Point Title Audit: What Every Bengaluru Land Buyer Must Check",
    excerpt: "Before signing any sale agreement, learn how to audit 30-year mother deeds, Form 15/16 Encumbrance Certificates, and BDA layout approvals.",
    date: "12 September 2026",
    readTime: "6 min read",
    category: "Legal Diligence",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  },
  {
    slug: "bangalore-metro-phase-3-appreciation",
    title: "Metro Phase 3 & Peripheral Ring Road: Top 5 Corridors Gaining 18% YoY",
    excerpt: "A deep dive into Sarjapur, Whitefield Extension, and North Bengaluru infrastructure milestones driving capital appreciation.",
    date: "28 August 2026",
    readTime: "8 min read",
    category: "Market Trends",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  },
  {
    slug: "nri-guide-to-buying-land-in-india",
    title: "The 2026 NRI Guide: Remote Property Acquisition & Power of Attorney",
    excerpt: "How overseas buyers in the UAE, US, and UK legally acquire verified plots and villas without traveling to India.",
    date: "14 August 2026",
    readTime: "7 min read",
    category: "NRI Advisory",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        <div className="max-w-2xl mb-12">
          <Eyebrow>Market Intelligence</Eyebrow>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-white">Insights & Buying Guides</h1>
          <p className="mt-2 text-base text-slate-400">
            Expert analysis from our in-house advocates and location intelligence team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="glass group flex flex-col overflow-hidden rounded-3xl border border-white/10 hover:border-gold-400/40 transition hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-ink-900">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="rounded-full bg-gold-400/10 border border-gold-400/25 px-2.5 py-0.5 font-bold text-gold-300">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>

                <h2 className="font-display text-lg font-semibold text-white group-hover:text-gold-300 transition">
                  {post.title}
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.date}</span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 font-semibold text-gold-400 hover:text-gold-300"
                  >
                    Read Guide <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
