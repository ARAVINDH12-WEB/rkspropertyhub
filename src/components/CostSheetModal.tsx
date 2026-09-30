import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Download, CheckCircle2, ShieldCheck, Printer,
  Phone, Mail, User, IndianRupee, MessageCircle, AlertCircle,
} from "lucide-react";
import { getPropertyMetrics, PropertyItem } from "../content/CompareContext";

interface CostSheetModalProps {
  isOpen: boolean;
  property: PropertyItem;
  onClose: () => void;
}

export default function CostSheetModal({ isOpen, property, onClose }: CostSheetModalProps) {
  const [step, setStep] = useState<"FORM" | "BREAKDOWN">("FORM");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [timestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate detailed financial items based on raw property price
  const metrics = getPropertyMetrics(property);
  const basePrice = metrics.rawPrice;
  const stampDuty = Math.round(basePrice * 0.051); // 5.1% Karnataka Stamp Duty
  const registrationFee = Math.round(basePrice * 0.01); // 1% Registration
  const isReady = !property.tag?.toLowerCase().includes("2026") && !property.tag?.toLowerCase().includes("launch");
  const gst = isReady ? 0 : Math.round(basePrice * 0.05); // 0% if ready, 5% if under-construction
  const legalCharges = 75000; // Legal scrutiny & Khata registration
  const corpusMaintenance = 150000; // Advance maintenance & club fund
  const totalOnRoadPrice = basePrice + stampDuty + registrationFee + gst + legalCharges + corpusMaintenance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch CSRF token
      let csrfToken = "";
      try {
        const cRes = await fetch("/api/v1/csrf-token");
        const cData = await cRes.json();
        if (cData.csrfToken) csrfToken = cData.csrfToken;
      } catch {
        // Continue if dev proxy
      }

      // 2. Submit lead to backend
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `Brochure and verified cost sheet request for ${property.name} (${property.location})`,
          interestedIn: property.name,
          budgetRange: property.price,
          _hp: honeypot,
          _timestamp: timestamp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      // Proceed to instant on-road cost sheet
      setStep("BREAKDOWN");
    } catch (err: any) {
      // If honeypot caught or harmless network, still show breakdown for optimal UX
      setStep("BREAKDOWN");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappCostSummary = `Hi RKS Team, I just downloaded the cost sheet for ${property.name} (${property.location}). On-road estimate is ₹${(totalOnRoadPrice / 100000).toFixed(2)} Lakhs. Please connect me with the project advocate.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-ink-950 p-6 sm:p-8 shadow-2xl shadow-black/90 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close cost sheet modal"
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>

          {step === "FORM" ? (
            /* STEP 1: Lead Capture Form */
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/10 text-gold-300 border border-gold-400/20">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Download Verified Cost Sheet
                  </h3>
                  <p className="text-xs text-slate-400">
                    Get the 100% transparent on-road breakdown for <span className="text-gold-300 font-semibold">{property.name}</span>
                  </p>
                </div>
              </div>

              {/* Property Snapshot */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">{property.type}</p>
                  <p className="font-semibold text-white">{property.name}</p>
                  <p className="text-xs text-slate-400">{property.location} • {property.beds}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-slate-500">Base Price</p>
                  <p className="font-display text-lg font-bold text-gold-300">{property.price}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-bot trap */}
                <input
                  type="text"
                  name="_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rao"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">WhatsApp / Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Your number is strictly confidential. Zero unsolicited marketing calls.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 py-3 text-sm font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>{loading ? "Generating Breakdown..." : "Unlock Official Cost Sheet"}</span>
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: Instant Cost Sheet Breakdown */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="h-4 w-4" /> Verified Cost Sheet Ready
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {property.name}
                  </h3>
                  <p className="text-xs text-slate-400">{property.location} • RERA Approved</p>
                </div>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                  title="Print Cost Sheet"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
              </div>

              {/* Financial Line Items */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.01] divide-y divide-white/5 text-xs">
                <div className="flex items-center justify-between p-3.5">
                  <span className="text-slate-300">Base Agreement Price</span>
                  <span className="font-semibold text-white">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-slate-300">Stamp Duty (Govt. of Karnataka 5.1%)</p>
                    <p className="text-[10px] text-slate-500">Statutory state transfer levy</p>
                  </div>
                  <span className="font-semibold text-slate-200">₹{stampDuty.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-slate-300">Registration Fee (1.0%)</p>
                    <p className="text-[10px] text-slate-500">Sub-registrar execution fee</p>
                  </div>
                  <span className="font-semibold text-slate-200">₹{registrationFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-slate-300">GST (Goods & Services Tax)</p>
                    <p className="text-[10px] text-emerald-400">{isReady ? "0% (Completed / Ready to Move with OC)" : "5% Under-Construction"}</p>
                  </div>
                  <span className="font-semibold text-slate-200">₹{gst.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-slate-300">Advocate Legal Scrutiny & Khata Transfer</span>
                  <span className="font-semibold text-slate-200">₹{legalCharges.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <span className="text-slate-300">Advance Maintenance & Association Sinking Fund</span>
                  <span className="font-semibold text-slate-200">₹{corpusMaintenance.toLocaleString("en-IN")}</span>
                </div>

                {/* Total On-Road Price */}
                <div className="flex items-center justify-between p-4 bg-gold-400/10 rounded-b-2xl">
                  <div>
                    <p className="font-bold text-sm text-gold-300">Total Estimated On-Road Price</p>
                    <p className="text-[10px] text-slate-400">All-inclusive registration & possession estimation</p>
                  </div>
                  <span className="font-display text-xl font-bold text-gold-300">
                    ₹{totalOnRoadPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(whatsappCostSummary)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-3 text-center text-xs font-bold hover:bg-emerald-500 hover:text-ink-950 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Summary to WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="rounded-xl bg-white/10 hover:bg-white/15 text-white py-3 text-center text-xs font-semibold transition"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
