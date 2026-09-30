import { ShieldCheck, Lock, FileText, ArrowLeft } from "lucide-react";
import { Container } from "../../components/ui";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-20 text-slate-300">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-8 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        <div className="max-w-3xl space-y-8 glass rounded-3xl p-8 sm:p-12 border border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 border border-gold-400/25 px-3 py-1 text-xs font-bold text-gold-300 mb-3">
              <ShieldCheck className="h-3.5 w-3.5" /> Legal & Compliance
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white">Privacy Policy</h1>
            <p className="mt-2 text-xs text-slate-400">Last updated: September 2026 · Compliant with Digital Personal Data Protection (DPDP) Act 2023 & GDPR principles</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
              <p>
                RKS Realty Pvt. Ltd. collects information that you provide directly to us when you schedule property visits, submit consultation inquiries, request free property valuations, or create an account. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Contact details: Name, email address, phone number, and physical mailing address.</li>
                <li>Property preferences: Desired zone/location, property type (Villa, Plot, Apartment), and budget parameters.</li>
                <li>Pre-qualification & Documents: Optional verification documents (identity proof, survey sketches, pre-approval letters) submitted for title checks.</li>
                <li>Technical data: IP addresses, user agent strings, and session identifiers collected for security audit logs.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">2. Data Protection & Encryption at Rest</h2>
              <p>
                We employ defense-in-depth security standards to safeguard all personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><strong>Encryption at Rest:</strong> Sensitive personal identifiers and documents are encrypted using authenticated AES-256-GCM.</li>
                <li><strong>Transport Security:</strong> All data in transit is encrypted using modern TLS 1.3 / HTTPS with Strict-Transport-Security (HSTS).</li>
                <li><strong>Access Control:</strong> Strict Role-Based Access Control (RBAC) ensures only authorized advisors can access buyer records for scheduled viewings.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. How We Use Your Data</h2>
              <p>
                Your information is used solely to provide verified real estate advisory services:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Scheduling and coordinating in-person property walkthroughs and site visits.</li>
                <li>Generating customized property shortlists and legal audit snapshot reports.</li>
                <li>Transmitting pre-approved loan requests to partner banks only upon your explicit request.</li>
                <li>Maintaining compliance with RERA (Real Estate Regulatory Authority) regulations.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">4. No Sale of Personal Data</h2>
              <p>
                We do not sell, rent, or trade your personal information to third-party telemarketers or external broker networks. We only disclose details to partner advocates or banking desks when required to facilitate your transaction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">5. Your Rights & Data Erasure</h2>
              <p>
                Under applicable privacy regulations, you have the right to request access to your personal information, request corrections, or ask for complete deletion of your data from our active databases. Contact our Data Protection Officer at:
              </p>
              <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-gold-300">
                privacy@rksrealty.in · RKS Realty Legal Desk, 12, Residency Road, Bengaluru 560025
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
