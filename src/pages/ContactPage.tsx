import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Advisory Inquiry");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // Honeypot field
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          interestedIn: subject,
          message,
          _hp: hp,
          _timestamp: Date.now() - 2000,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit message");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please call us directly.");
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

        <div className="max-w-2xl mb-12">
          <Eyebrow>Direct Advisory Desk</Eyebrow>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-white">Get in Touch</h1>
          <p className="mt-2 text-base text-slate-400">
            Have questions about land verification, khata mutation, or an upcoming project? Our senior buying advisors are ready to assist.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">Bengaluru Headquarters</h3>
                <p className="mt-2 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                  12, Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025
                </p>
              </div>

              <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-400">Direct Consultation Line</p>
                    <a href="tel:+911234567890" className="text-sm font-semibold text-white hover:text-gold-300">
                      +91 12345 67890
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-400">Advisory Inquiries</p>
                    <a href="mailto:hello@rksrealty.in" className="text-sm font-semibold text-white hover:text-gold-300">
                      hello@rksrealty.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-400">Advisory Desk Hours</p>
                    <p className="text-sm font-medium text-white">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 border border-white/15 shadow-2xl">
              <h2 className="font-display text-2xl text-white">Send a Message</h2>
              <p className="text-xs text-slate-400 mt-1">We typically reply within one business day.</p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <h3 className="font-display text-xl text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    An RKS senior advisor will review your inquiry and reach out with verified options.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  {/* Honeypot field for bot suppression */}
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
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Menon"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-gold-400/60 focus:outline-none"
                      >
                        <option value="General Advisory Inquiry" className="bg-ink-900">General Advisory</option>
                        <option value="Title Verification Support" className="bg-ink-900">Title Verification</option>
                        <option value="Residential Plot / Farmland" className="bg-ink-900">Plots & Farmland</option>
                        <option value="Luxury Villa Shortlist" className="bg-ink-900">Luxury Villas</option>
                        <option value="NRI Remote Acquisition" className="bg-ink-900">NRI Remote Buying</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you're looking for (budget, preferred zone, timeframe)…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 py-3 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? "Sending Inquiry…" : "Submit Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
