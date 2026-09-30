import { Home, Search, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center py-20 text-slate-200">
      <Container className="text-center max-w-xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gold-400/10 border border-gold-400/30 text-gold-300 mb-6">
          <span className="font-display text-4xl font-extrabold">404</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-white">Page Not Found</h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          The property listing or page you're searching for may have been moved, sold, or is currently undergoing legal verification.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition"
          >
            <Home className="h-4 w-4" /> Return to Home
          </a>
          <a
            href="#/properties"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            <Search className="h-4 w-4" /> Browse Properties
          </a>
        </div>
      </Container>
    </div>
  );
}
