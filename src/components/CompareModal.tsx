import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, Minus, ShieldCheck, MapPin, Maximize2, Bed, ArrowUpRight,
  TrendingUp, Percent, Building2, PhoneCall, FileText, Scale,
} from "lucide-react";
import { useCompare, getPropertyMetrics } from "../content/CompareContext";
import { Container } from "./ui";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCostSheet?: (propertyName: string) => void;
}

export default function CompareModal({ isOpen, onClose, onOpenCostSheet }: CompareModalProps) {
  const { selectedProperties, removeFromCompare, clearCompare } = useCompare();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border border-white/15 bg-ink-950 shadow-2xl shadow-black/90 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-ink-900/60 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 text-gold-300 border border-gold-400/20">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Side-by-Side Property Comparison</span>
                  <span className="rounded-full bg-gold-400/20 text-gold-300 text-xs px-2.5 py-0.5 border border-gold-400/30">
                    {selectedProperties.length} Properties
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Compare pricing, carpet area, rental yield, title verification and amenities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedProperties.length > 0 && (
                <button
                  onClick={clearCompare}
                  className="text-xs text-slate-400 hover:text-rose-400 transition hidden sm:inline"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close comparison"
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Content / Comparison Matrix */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 space-y-8">
            {selectedProperties.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-slate-400 mx-auto">
                  <Scale className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-white">No properties selected for comparison</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Click the <span className="text-gold-400 font-semibold">[+ Compare]</span> button on any property listing to compare features side-by-side.
                </p>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-gold-400 px-5 py-2.5 text-xs font-bold text-ink-950 transition hover:bg-gold-300"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="min-w-[650px]">
                {/* 1. Property Cards Top Row */}
                <div className={`grid gap-4 ${selectedProperties.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : selectedProperties.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {selectedProperties.map((p, pIdx) => {
                    const slug = (p.name || `property-${pIdx}`).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `property-${pIdx}`;
                    const metrics = getPropertyMetrics(p);

                    return (
                      <div
                        key={p.name}
                        className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between overflow-hidden"
                      >
                        <button
                          onClick={() => removeFromCompare(p.name)}
                          aria-label={`Remove ${p.name}`}
                          className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-ink-950/80 text-slate-300 hover:text-rose-400 backdrop-blur transition"
                          title="Remove from comparison"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        <div>
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-ink-900">
                            <img src={p.img || "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"} alt={p.name} className="h-full w-full object-cover" />
                            <span className="absolute left-2.5 bottom-2.5 rounded-full bg-ink-950/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur border border-white/10">
                              {p.type}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-white truncate">
                            {p.name}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-gold-400 shrink-0" />
                            {p.location}
                          </p>

                          <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-slate-500">Price</p>
                              <p className="font-display text-xl font-bold text-gold-300">{p.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500">Rate</p>
                              <p className="text-xs font-semibold text-slate-200">{metrics.pricePerSqFt}</p>
                            </div>
                          </div>
                        </div>

                        {/* Direct Card Actions */}
                        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                          <a
                            href={`#/property/${slug}`}
                            onClick={onClose}
                            className="rounded-xl border border-white/15 bg-white/5 py-2 text-center text-xs font-semibold text-white transition hover:bg-gold-400 hover:text-ink-950 hover:border-gold-400"
                          >
                            Full Details
                          </a>

                          <a
                            href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi RKS Team, I am comparing ${p.name} (${p.location}) and would like the detailed price sheet and legal audit.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-2 text-center text-xs font-semibold hover:bg-emerald-500 hover:text-ink-950 transition flex items-center justify-center gap-1"
                          >
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Side-by-Side Detailed Rows */}
                <div className="mt-8 space-y-6">
                  {/* Category: Financials & Appreciation */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Financials & Investment Returns
                    </h4>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/5 text-xs">
                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Price per Sq.Ft</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-white font-semibold">
                            {getPropertyMetrics(p).pricePerSqFt}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Total Carpet Area</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-white">
                            {getPropertyMetrics(p).carpetAreaSqFt}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Expected Rental Yield</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-emerald-300 font-semibold">
                            {getPropertyMetrics(p).rentalYield}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Annual Appreciation</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-gold-300 font-semibold">
                            {getPropertyMetrics(p).annualAppreciation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category: Space & Specifications */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Space & Layout Details
                    </h4>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/5 text-xs">
                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Configuration</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-white">
                            {p.beds}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Total Dimensions</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-white">
                            {p.size}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Status / Possession</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-slate-200">
                            {p.tag || "Ready to Move"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category: Legal Title & Bank Approvals */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Legal Title & Verification
                    </h4>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/5 text-xs">
                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Title Status</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="h-3.5 w-3.5" /> 100% Clear & Verified
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">RERA Registration</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-slate-300 font-mono text-[11px]">
                            {getPropertyMetrics(p).reraNumber}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 p-3.5 items-center font-medium">
                        <span className="text-slate-400">Pre-Approved Banks</span>
                        {selectedProperties.map((p) => (
                          <span key={p.name} className="text-slate-300">
                            SBI, HDFC, ICICI, Axis
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category: Gated Community Amenities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4" /> Gated Community Amenities
                    </h4>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/5 text-xs">
                      {[
                        "24/7 Manned Security & CCTV",
                        "100% DG Power Backup",
                        "Clubhouse & Community Hall",
                        "Underground Cabling & Drainage",
                        "EV Charging Infrastructure",
                        "Rainwater Harvesting System",
                        "Swimming Pool & Gym",
                        "Children Play Park",
                      ].map((amenity) => (
                        <div key={amenity} className="grid grid-cols-4 p-3.5 items-center font-medium">
                          <span className="text-slate-400">{amenity}</span>
                          {selectedProperties.map((p) => {
                            const hasAmenity = getPropertyMetrics(p).amenities.find((a) => a.name === amenity)?.available;
                            return (
                              <span key={p.name} className="flex items-center">
                                {hasAmenity ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-400">
                                    <Check className="h-4 w-4" /> Included
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-slate-500">
                                    <Minus className="h-4 w-4" /> N/A
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
