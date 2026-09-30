import { useState } from "react";
import {
  ShieldCheck, MapPin, Maximize2, Bed, ArrowLeft, Calendar,
  Clock, Phone, Mail, CheckCircle2, FileText, Download, Share2,
  MessageCircle, Scale,
} from "lucide-react";
import { Container, Eyebrow } from "../components/ui";
import { useContent } from "../content/ContentContext";
import { useCompare } from "../content/CompareContext";
import CostSheetModal from "../components/CostSheetModal";

interface PropertyDetailPageProps {
  slug?: string;
}

export default function PropertyDetailPage({ slug }: PropertyDetailPageProps) {
  const { content } = useContent();
  const { toggleCompare, isInCompare } = useCompare();
  const properties = content.showcase.properties;

  // Match property from slug with multi-strategy lookup (slug, clean name, index)
  const rawSlug = decodeURIComponent(slug || "").toLowerCase().trim();
  const normalizedTarget = rawSlug.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const property =
    properties.find((p, idx) => {
      const pName = (p.name || "").toLowerCase().trim();
      const pNorm = pName.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (pNorm && pNorm === normalizedTarget) return true;
      if (rawSlug === `property-${idx}` || rawSlug === String(idx)) return true;
      return false;
    }) ||
    properties.find((p) => {
      const pName = (p.name || "").toLowerCase().trim();
      const pClean = pName.replace(/[^a-z0-9]/g, "");
      const tClean = normalizedTarget.replace(/[^a-z0-9]/g, "");
      return pClean && tClean && (pClean.includes(tClean) || tClean.includes(pClean));
    }) ||
    properties[0] || {
      name: "Property Details",
      type: "Residential",
      location: "Bengaluru",
      price: "Price on request",
      size: "Spacious",
      beds: "Luxury",
      tag: "Verified",
      img: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    };

  // Modals and form state
  const [costSheetOpen, setCostSheetOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: "default-visit-id",
          visitorName,
          visitorEmail,
          visitorPhone,
          visitDate: new Date(visitDate).toISOString(),
          timeSlot,
          notes: notes || `Inquiry for ${property.name}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to schedule visit");
      setBooked(true);
    } catch (err: any) {
      setError(err.message || "Could not schedule viewing. Please call our desk.");
    } finally {
      setSubmitting(false);
    }
  };

  const phone = content.brand.phone.replace(/[^\d]/g, "") || "919876543210";
  const intlPhone = phone.startsWith("91") ? phone : `91${phone}`;
  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
    `Hi RKS Team, I am looking at ${property.name}${property.location ? ` in ${property.location}` : ""}${property.price ? ` (${property.price})` : ""} and would like to review the official title audit and schedule a private inspection.`
  )}`;

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        {/* Navigation Breadcrumb & Actions Bar */}
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
            <span className="text-xs text-slate-300 font-medium truncate max-w-[200px]">
              {property.name}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Compare Toggle Button */}
            <button
              onClick={() => toggleCompare(property)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                isInCompare(property.name)
                  ? "bg-gold-400 text-ink-950 border-gold-400 shadow-lg shadow-gold-500/25"
                  : "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{isInCompare(property.name) ? "Comparing (Selected)" : "+ Add to Compare"}</span>
            </button>

            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> 42-Pt Title Verified
            </span>
          </div>
        </div>

        {/* Hero Gallery & Title */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-ink-900">
              <img
                src={property.img}
                alt={property.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="rounded-full bg-gold-400 px-3.5 py-1 text-xs font-bold text-ink-950 uppercase tracking-wider">
                  {property.type}
                </span>
                <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white">
                  {property.name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  {property.location}
                </p>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.size && (
                <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-xs uppercase font-medium text-slate-400">Total Area</p>
                  <p className="mt-1 font-display text-xl font-bold text-white">{property.size}</p>
                </div>
              )}
              {property.beds && (
                <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-xs uppercase font-medium text-slate-400">Configuration</p>
                  <p className="mt-1 font-display text-xl font-bold text-white">{property.beds}</p>
                </div>
              )}
              <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-xs uppercase font-medium text-slate-400">Status</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-300">{property.tag || "100% Clear"}</p>
              </div>
              {property.price && (
                <div className="glass rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-xs uppercase font-medium text-slate-400">Price</p>
                  <p className="mt-1 font-display text-xl font-bold text-gold-300">{property.price}</p>
                </div>
              )}
            </div>

            {/* 42-Point Title Audit Snapshot */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-gold-400" />
                <h2 className="font-display text-xl text-white">RKS 42-Point Legal Audit Certificate</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Prior to listing, our advocates audited 30-year mother deeds, encumbrance certificates (Form 15 & 16), revenue sketches, RERA compliance, and BDA/DTCP layout sanction orders.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 30-Year Non-Encumbrance Certified
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Khata / Patta Verified & Freehold
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> RERA Sanction Approved
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Bank Approved (SBI, HDFC, ICICI, Axis)
                </div>
              </div>
            </div>

            {/* Location & Neighborhood Intelligence */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h2 className="font-display text-xl text-white">Location Intelligence & Appreciation</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Situated in high-growth prime corridors{property.location ? ` of ${property.location}` : ""} with average annual appreciation of 12–14%. Excellent connectivity to upcoming transit corridors, schools, and commercial hubs.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                  🚆 Metro Station: 10 mins
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                  🏫 Top Schools: 5 mins
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                  🏥 Multi-Specialty Hospital: 12 mins
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                  ✈️ Airport Express Highway: 35 mins
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Booking Form */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Lead Magnet Card: Download Brochure & Cost Sheet */}
            <div className="glass rounded-3xl p-6 border border-gold-400/30 bg-gradient-to-br from-gold-500/10 via-ink-900/60 to-ink-950 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="h-4 w-4" /> Official Documentation
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Download Cost Sheet & Brochure
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive the all-inclusive on-road breakdown including stamp duty, registration, GST, and 42-point title certificate.
              </p>
              <button
                onClick={() => setCostSheetOpen(true)}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 py-3 text-xs font-bold text-ink-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Get Instant Cost Sheet (PDF)</span>
              </button>
            </div>

            {/* 2. Direct WhatsApp Advisor Card */}
            <div className="glass rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <MessageCircle className="h-4 w-4" /> Instant Response
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Chat Directly on WhatsApp
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect 1-on-1 with the dedicated advisor for {property.name} to receive live video walkthroughs or ask specific title questions.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-ink-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat with Advisor on WhatsApp</span>
              </a>
            </div>

            {/* 3. Schedule Site Visit Form */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                Complimentary Service
              </span>
              <h3 className="mt-1 font-display text-2xl text-white">Book a Guided Site Visit</h3>
              <p className="mt-1 text-xs text-slate-400">
                Private cab pickup from your home or office with a licensed buying advisor.
              </p>

              {booked ? (
                <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                  <p className="text-sm font-bold text-white">Visit Scheduled!</p>
                  <p className="text-xs text-slate-300">
                    Our team will call you within 2 hours to confirm your private cab pickup details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookVisit} className="mt-6 space-y-3.5">
                  {error && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={visitDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none"
                      >
                        <option value="10:00 AM - 12:00 PM" className="bg-ink-900">Morning (10am)</option>
                        <option value="02:00 PM - 04:00 PM" className="bg-ink-900">Afternoon (2pm)</option>
                        <option value="04:00 PM - 06:00 PM" className="bg-ink-900">Evening (4pm)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 py-3 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25 disabled:opacity-50"
                  >
                    {submitting ? "Reserving Slot…" : "Schedule Private Viewing"}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    No obligations · 100% free private cab pickup
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Cost Sheet & Brochure Modal */}
      <CostSheetModal
        isOpen={costSheetOpen}
        property={property}
        onClose={() => setCostSheetOpen(false)}
      />
    </div>
  );
}
