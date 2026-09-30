import { useState, useEffect } from "react";
import { Calculator, ArrowLeft, IndianRupee, PieChart, Info, CheckCircle2 } from "lucide-react";
import { Container, Eyebrow } from "../components/ui";

export default function CalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(12000000); // 1.2 Cr
  const [downPayment, setDownPayment] = useState(2400000); // 20%
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  // Client-side instant recalculation & sync with backend calculation
  useEffect(() => {
    const principal = Math.max(0, propertyPrice - downPayment);
    if (principal <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayable(0);
      return;
    }

    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    const calcEmi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const payable = calcEmi * n;
    const interest = payable - principal;

    setEmi(Math.round(calcEmi));
    setTotalInterest(Math.round(interest));
    setTotalPayable(Math.round(payable));
  }, [propertyPrice, downPayment, interestRate, tenureYears]);

  const principal = Math.max(0, propertyPrice - downPayment);

  const formatLakhCr = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
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

        <div className="max-w-3xl mb-10">
          <Eyebrow>Financial Intelligence</Eyebrow>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-white">
            Mortgage & EMI Affordability Calculator
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Plan your home or land purchase with precision. We partner with 8 banks (SBI, HDFC, ICICI, Axis) with pre-negotiated interest rates.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Sliders Input Form */}
          <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h2 className="font-display text-xl text-white">Loan Parameters</h2>

            {/* Property Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Property Value
                </label>
                <span className="font-display text-lg font-bold text-white">
                  {formatLakhCr(propertyPrice)}
                </span>
              </div>
              <input
                type="range"
                min={2000000}
                max={50000000}
                step={500000}
                value={propertyPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPropertyPrice(val);
                  if (downPayment > val) setDownPayment(Math.round(val * 0.2));
                }}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹20 L</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr+</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Down Payment ({Math.round((downPayment / propertyPrice) * 100)}%)
                </label>
                <span className="font-display text-lg font-bold text-white">
                  {formatLakhCr(downPayment)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(propertyPrice * 0.1)}
                max={Math.round(propertyPrice * 0.8)}
                step={100000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>10% min</span>
                <span>20% standard</span>
                <span>80% max</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interest Rate (p.a.)
                </label>
                <span className="font-display text-lg font-bold text-gold-300">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={7.5}
                max={14.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>7.5% (Prime)</span>
                <span>8.5% (Average)</span>
                <span>14% (Commercial)</span>
              </div>
            </div>

            {/* Tenure Years */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Loan Tenure
                </label>
                <span className="font-display text-lg font-bold text-white">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>5 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 text-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Monthly EMI</p>
                <p className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-gradient-gold">
                  ₹{emi.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-slate-400">per month for {tenureYears} years</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Loan Amount (Principal):</span>
                  <span className="font-semibold text-white">₹{principal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Interest Payable:</span>
                  <span className="font-semibold text-gold-300">₹{totalInterest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold">
                  <span className="text-white">Total Amount Payable:</span>
                  <span className="text-white">₹{totalPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 py-3 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition"
              >
                Apply for Pre-Approved Loan
              </a>

              <p className="text-[11px] text-slate-500">
                Partnered with SBI, HDFC, ICICI, Axis. Approval in as little as 72 hours.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
