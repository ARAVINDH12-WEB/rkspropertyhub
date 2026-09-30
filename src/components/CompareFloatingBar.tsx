import { AnimatePresence, motion } from "framer-motion";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "../content/CompareContext";

interface CompareFloatingBarProps {
  onOpenCompare: () => void;
}

export default function CompareFloatingBar({ onOpenCompare }: CompareFloatingBarProps) {
  const { selectedProperties, removeFromCompare, clearCompare, maxProperties } = useCompare();

  if (selectedProperties.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        aria-label="Property comparison tray"
        className="fixed bottom-6 inset-x-4 z-40 mx-auto max-w-4xl"
      >
        <div className="glass rounded-2xl border border-gold-400/40 bg-ink-950/95 p-3.5 sm:p-4 shadow-2xl shadow-black/90 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Indicator & Thumbnails */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 font-bold shadow-lg shadow-gold-500/25">
                <Scale className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    Compare Tray
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {selectedProperties.length} of {maxProperties}
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Select up to 3 homes to compare pricing, specs & amenities
                </p>
              </div>

              {/* Thumbnails preview */}
              <div className="flex items-center gap-2 ml-auto sm:ml-4">
                {selectedProperties.map((p) => (
                  <div
                    key={p.name}
                    className="group relative h-10 w-10 rounded-lg overflow-hidden border border-white/20 bg-ink-900 shrink-0"
                    title={p.name}
                  >
                    <img src={p.img || "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"} alt={p.name} className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(p.name);
                      }}
                      aria-label={`Remove ${p.name}`}
                      className="absolute inset-0 bg-ink-950/80 opacity-0 group-hover:opacity-100 grid place-items-center text-rose-400 transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={clearCompare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
                title="Clear all selected properties"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>

              <button
                onClick={onOpenCompare}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-5 py-2 text-xs font-bold text-ink-950 transition hover:scale-105 hover:shadow-lg hover:shadow-gold-500/30"
              >
                <span>Compare Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
