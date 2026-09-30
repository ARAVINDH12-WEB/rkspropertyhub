import React from "react";
import { ShieldCheck, FileSearch, Scale, Building2, LockKeyhole } from "lucide-react";

export const TrustSection: React.FC = () => {
  const steps = [
    {
      icon: FileSearch,
      title: "30-Year Revenue Search",
      desc: "Comprehensive check of EC (Encumbrance Certificates), Khata records, and RTC survey documents.",
    },
    {
      icon: Scale,
      title: "Independent Legal Opinion",
      desc: "Vetted by senior High Court real estate advocates ensuring zero litigation or mortgage encumbrance.",
    },
    {
      icon: Building2,
      title: "RERA & Master Plan Audit",
      desc: "Verification of DC Conversion, RERA approvals, and BDA/BMRDA layout sanction plans.",
    },
    {
      icon: LockKeyhole,
      title: "Clear Ownership Deed",
      desc: "Guaranteed marketable title title deed transfer with transparent end-to-end legal support.",
    },
  ];

  return (
    <section id="title-verification" className="py-20 bg-slate-950 border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Our 4-Step Legal Verification Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How We Protect Your Land & Home Investment
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Every plot, villa, and apartment listed on RKS Realty undergoes strict multi-tier legal audit before reaching buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl relative hover:border-amber-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-amber-500/40 uppercase tracking-widest block mb-1">
                  Step 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
