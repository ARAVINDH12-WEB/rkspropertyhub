import { ShieldCheck, Award, Users, Phone, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";

const ADVISORS = [
  {
    name: "Rajesh Kulkarni",
    role: "Senior Land & Legal Diligence Lead",
    experience: "16+ years experience in Karnataka Revenue & DTCP laws",
    phone: "+91 98450 12345",
    email: "rajesh.agent@rksrealty.com",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Ananya Deshmukh",
    role: "Luxury Residential & Villa Specialist",
    experience: "Managed over ₹350 Cr in Whitefield & North Bengaluru transactions",
    phone: "+91 98450 67890",
    email: "ananya@rksrealty.in",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Vikramaditya Rao",
    role: "NRI Portfolio & Land Banking Advisor",
    experience: "Assisted 400+ NRI families in Dubai, Singapore & US with remote acquisition",
    phone: "+91 98450 99887",
    email: "vikram@rksrealty.in",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </a>

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <Eyebrow>About RKS Realty</Eyebrow>
          <h1 className="font-display text-4xl sm:text-6xl text-white">
            Curating land and homes <span className="text-gradient-gold">worth owning</span> for generations.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-slate-400">
            Founded in 2009 in Bengaluru, RKS Realty was built around one guiding premise: buying property should not feel like an intimidating gamble. We replace traditional broker ambiguity with institutional title diligence and honest pricing.
          </p>
        </div>

        {/* Credentials & Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/10 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-gold-400 mb-2" />
            <p className="font-display text-2xl font-bold text-white">16+ Years</p>
            <p className="text-xs text-slate-400 mt-1">Market Leadership</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/10 text-center">
            <Award className="mx-auto h-7 w-7 text-gold-400 mb-2" />
            <p className="font-display text-2xl font-bold text-white">2,400+</p>
            <p className="text-xs text-slate-400 mt-1">Families Housed</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/10 text-center">
            <Users className="mx-auto h-7 w-7 text-gold-400 mb-2" />
            <p className="font-display text-2xl font-bold text-white">850+ Acres</p>
            <p className="text-xs text-slate-400 mt-1">Verified Land Sold</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/10 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400 mb-2" />
            <p className="font-display text-2xl font-bold text-white">98%</p>
            <p className="text-xs text-slate-400 mt-1">Referral Rate</p>
          </div>
        </div>

        {/* Regulatory Disclosures */}
        <div className="mt-12 glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <h2 className="font-display text-xl text-white">Accreditations & Compliance</h2>
          <p className="mt-2 text-sm text-slate-300">
            RKS Realty Pvt. Ltd. is fully certified under the Real Estate Regulatory Authority:
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-gold-300">
            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2">
              RERA Reg: PRM/KA/RERA/1251/446/AG/2024
            </span>
            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2">
              CREDAI Member ID: CR-KA-2016-891
            </span>
            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2">
              Corporate ID: U70102KA2009PTC049812
            </span>
          </div>
        </div>

        {/* Licensed Buying Advisors */}
        <div className="mt-16 space-y-8">
          <div>
            <Eyebrow>Our Leadership</Eyebrow>
            <h2 className="mt-2 font-display text-3xl text-white">Meet Your Dedicated Advisors</h2>
            <p className="mt-1 text-sm text-slate-400">
              Direct access to seasoned legal and transaction advisors throughout your buying journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ADVISORS.map((adv) => (
              <div
                key={adv.name}
                className="glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-gold-400/40 transition"
              >
                <div>
                  <div className="aspect-square w-24 overflow-hidden rounded-2xl border border-white/15 mb-4">
                    <img src={adv.img} alt={adv.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-display text-xl text-white">{adv.name}</h3>
                  <p className="text-xs font-bold text-gold-400 uppercase tracking-wide mt-0.5">{adv.role}</p>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">{adv.experience}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-xs text-slate-400">
                  <a href={`tel:${adv.phone}`} className="flex items-center gap-2 hover:text-white transition">
                    <Phone className="h-3.5 w-3.5 text-gold-400" /> {adv.phone}
                  </a>
                  <a href={`mailto:${adv.email}`} className="flex items-center gap-2 hover:text-white transition">
                    <Mail className="h-3.5 w-3.5 text-gold-400" /> {adv.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
