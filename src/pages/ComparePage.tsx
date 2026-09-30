import { useState } from "react";
import { Container } from "../components/ui";
import { useCompare, getPropertyMetrics } from "../content/CompareContext";
import {
  Scale, ArrowLeft, X, Check, Minus, MapPin, TrendingUp, Building2,
  ShieldCheck, FileText, ArrowRight,
} from "lucide-react";
import CostSheetModal from "../components/CostSheetModal";

export default function ComparePage() {
  const { selectedProperties, removeFromCompare, clearCompare } = useCompare();
  const [costSheetProperty, setCostSheetProperty] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="#/properties"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition"
            >
              Properties
            </a>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-300 font-medium">Side-by-Side Comparison</span>
          </div>

          {selectedProperties.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition"
            >
              Clear Comparison Tray
            </button>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-bold text-gold-300 mb-3">
              <Scale className="h-3.5 w-3.5" /> Side-by-Side Property Evaluator
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Property Comparison Matrix
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Compare carpet area, price per sq.ft, expected annual rental yields, appreciation rates, and verified title credentials.
            </p>
          </div>
        </div>

        {/* Comparison Content */}
        {selectedProperties.length === 0 ? (
          <div className="glass rounded-3xl border border-white/10 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-slate-400 mx-auto">
              <Scale className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">No Properties in Tray</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our verified listings and click <span className="text-gold-400 font-semibold">[+ Compare]</span> to compare up to 3 properties side-by-side.
            </p>
            <a
              href="#/properties"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-400 px-5 py-2.5 text-xs font-bold text-ink-950 transition hover:bg-gold-300"
            >
              <span>Explore Properties</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="min-w-[700px]">
              {/* 1. Header Cards Grid */}
              <div className={`grid gap-4 ${selectedProperties.length === 1 ? "grid-cols-1 max-w-sm" : selectedProperties.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {selectedProperties.map((p, pIdx) => {
                  const slug = (p.name || `property-${pIdx}`).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `property-${pIdx}`;
                  const metrics = getPropertyMetrics(p);

                  return (
                    <div
                      key={p.name}
                      className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between"
                    >
                      <button
                        onClick={() => removeFromCompare(p.name)}
                        className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-ink-950/80 text-slate-300 hover:text-rose-400 backdrop-blur transition"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div>
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-ink-900">
                          <img src={p.img || "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000"} alt={p.name} className="h-full w-full object-cover" />
                          <span className="absolute left-3 bottom-3 rounded-full bg-ink-950/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur border border-white/10">
                            {p.type}
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold text-white truncate">{p.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                          {p.location}
                        </p>

                        <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
                          <div>
                            <p className="text-[10px] uppercase text-slate-500">Starting Price</p>
                            <p className="font-display text-2xl font-bold text-gold-300">{p.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-slate-500">Price / Sq.Ft</p>
                            <p className="text-sm font-semibold text-white">{metrics.pricePerSqFt}</p>
                          </div>
                        </div>
                      </div>

                      {/* Direct CTA Buttons */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`#/property/${slug}`}
                            className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-gold-400 hover:text-ink-950"
                          >
                            Full Details
                          </a>

                          <a
                            href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi RKS Team, I am comparing ${p.name} in ${p.location} and would like to review the official title audit and pricing.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-2.5 text-center text-xs font-semibold hover:bg-emerald-500 hover:text-ink-950 transition flex items-center justify-center gap-1"
                          >
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        <button
                          onClick={() => setCostSheetProperty(p)}
                          className="w-full rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 py-2.5 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25 flex items-center justify-center gap-1.5"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Get Cost Sheet Breakdown</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Side-by-Side Detailed Metrics */}
              <div className="mt-10 space-y-8">
                {/* Financials */}
                <div className="glass rounded-3xl border border-white/10 p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Financial & Appreciation Comparison
                  </h4>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Price per Sq.Ft</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-white font-semibold">{getPropertyMetrics(p).pricePerSqFt}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Estimated Carpet Area</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-white">{getPropertyMetrics(p).carpetAreaSqFt}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Expected Rental Yield</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-emerald-300 font-semibold">{getPropertyMetrics(p).rentalYield}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Historical YoY Growth</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-gold-300 font-semibold">{getPropertyMetrics(p).annualAppreciation}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="glass rounded-3xl border border-white/10 p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Space & Possession Specs
                  </h4>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Bedrooms / BHK</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-white">{p.beds}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Total Dimensions</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-white">{p.size}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Timeline / Status</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-slate-200">{p.tag || "Ready to Move"}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal & Title */}
                <div className="glass rounded-3xl border border-white/10 p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Legal Title & Verification Status
                  </h4>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">42-Point Title Audit</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> 100% Clear & Inspected
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">RERA Registration</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="font-mono text-slate-300 text-[11px]">{getPropertyMetrics(p).reraNumber}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 py-3.5">
                      <span className="text-slate-400 font-medium">Approved Financing</span>
                      {selectedProperties.map((p) => (
                        <span key={p.name} className="text-slate-300">SBI, HDFC, ICICI, Axis</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="glass rounded-3xl border border-white/10 p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
                    <Check className="h-4 w-4" /> Gated Community Amenities
                  </h4>
                  <div className="divide-y divide-white/5 text-xs">
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
                      <div key={amenity} className="grid grid-cols-4 py-3.5">
                        <span className="text-slate-400 font-medium">{amenity}</span>
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
          </div>
        )}
      </Container>

      {/* Cost Sheet Modal */}
      {costSheetProperty && (
        <CostSheetModal
          isOpen={!!costSheetProperty}
          property={costSheetProperty}
          onClose={() => setCostSheetProperty(null)}
        />
      )}
    </div>
  );
}
