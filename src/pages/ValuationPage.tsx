import { useState } from "react";
import { TrendingUp, ArrowLeft, CheckCircle2, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";

export default function ValuationPage() {
  const [propertyType, setPropertyType] = useState("VILLA");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [sizeSqFt, setSizeSqFt] = useState("");
  const [bedrooms, setBedrooms] = useState("3");
  const [condition, setCondition] = useState("EXCELLENT");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [hp, setHp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/valuation/valuation-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType,
          address,
          city,
          sizeSqFt: Number(sizeSqFt),
          bedrooms: propertyType !== "PLOT" ? Number(bedrooms) : undefined,
          condition,
          expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
          ownerName,
          ownerEmail,
          ownerPhone,
          _hp: hp,
          _timestamp: Date.now() - 2000,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit property details");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Could not generate valuation request. Please call our desk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        <div className="max-w-3xl mb-12">
          <Eyebrow>Seller Advisory</Eyebrow>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-white">
            Get a Free Property Valuation
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Selling land, an apartment, or a villa in Bengaluru? Receive a data-driven valuation report and neighborhood transaction comps within 24 hours. Zero upfront fees.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Benefits Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
              <h2 className="font-display text-xl text-white">Why List with RKS?</h2>
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Pre-Audited Buyer Pool:</strong>
                    <p className="text-slate-400 mt-0.5">Direct access to 2,400+ pre-approved buyers and active NRI investors seeking clear-title land.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Fair Market Comps:</strong>
                    <p className="text-slate-400 mt-0.5">We review real Sub-Registrar guidance values and recent neighborhood transaction prices.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Full Legal Desk Support:</strong>
                    <p className="text-slate-400 mt-0.5">Drafting agreements, clearing encumbrance certificates, and Sub-Registrar execution included.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Valuation Form */}
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 border border-white/15 shadow-2xl">
              <h2 className="font-display text-2xl text-white">Property Details</h2>
              <p className="text-xs text-slate-400 mt-1">Fill in the specs to receive your custom report.</p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <h3 className="font-display text-xl text-white">Valuation Request Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Our valuation desk is pulling Sub-Registrar comparables for your property. A licensed advisor will send your PDF valuation within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Submit Another Property
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_hp"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Property Type *
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      >
                        <option value="PLOT" className="bg-ink-900">Residential Plot</option>
                        <option value="VILLA" className="bg-ink-900">Independent Villa</option>
                        <option value="APARTMENT" className="bg-ink-900">Apartment / Flat</option>
                        <option value="COMMERCIAL" className="bg-ink-900">Commercial Land / Space</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Total Area (sq.ft) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 2400"
                        value={sizeSqFt}
                        onChange={(e) => setSizeSqFt(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Property Address / Layout Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Greenfield Layout, Sarjapur Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Condition
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      >
                        <option value="EXCELLENT" className="bg-ink-900">Ready / Brand New</option>
                        <option value="GOOD" className="bg-ink-900">Good Condition</option>
                        <option value="NEEDS_RENOVATION" className="bg-ink-900">Needs Renovation</option>
                        <option value="RAW_LAND" className="bg-ink-900">Clear Vacant Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Target Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="Optional"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Owner Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 py-3 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition disabled:opacity-50"
                  >
                    {submitting ? "Analyzing Comps…" : "Request Free Valuation Report"}
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    100% confidential · No telemarketing spam guarantee
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
