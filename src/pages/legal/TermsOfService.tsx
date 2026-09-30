import { FileText, ArrowLeft, Scale } from "lucide-react";
import { Container } from "../../components/ui";

export default function TermsOfService() {
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
              <Scale className="h-3.5 w-3.5" /> Terms & Regulations
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white">Terms of Service</h1>
            <p className="mt-2 text-xs text-slate-400">RERA Registered Real Estate Agency: PRM/KA/RERA/1251/446/AG/2024</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">1. Scope of Advisory Services</h2>
              <p>
                RKS Realty operates as a licensed property advisory firm. All listings published on our platform are verified through our 42-point title diligence framework prior to publication. While we strive for absolute precision in plot dimensions, pricing, and government zoning updates, prospective buyers are provided our comprehensive legal dossier for review prior to agreement execution.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">2. Fee Structure & Compensation</h2>
              <p>
                As advertised across our plans, RKS Realty charges zero upfront brokerage. Advisory success fees become payable exclusively upon the successful registration and stamp duty execution of the property at the Sub-Registrar Office.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. Intellectual Property</h2>
              <p>
                All photographs, architectural renders, legal audits, and location intelligence diagrams published on rksrealty.in are the intellectual property of RKS Realty Pvt. Ltd. Scraping, unauthorized reproduction, or republication is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">4. Dispute Resolution & Jurisdiction</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the State of Karnataka and the Real Estate (Regulation and Development) Act (RERA). Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, India.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
