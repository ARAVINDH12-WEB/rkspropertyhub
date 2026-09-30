import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Phone, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
  initialMode?: "LOGIN" | "REGISTER" | "FORGOT";
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = "LOGIN" }: AuthModalProps) {
  const [mode, setMode] = useState<"LOGIN" | "REGISTER" | "FORGOT" | "MFA">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      if (mode === "LOGIN" || mode === "MFA") {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, mfaToken: mfaCode || undefined }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        if (data.mfaRequired) {
          setMode("MFA");
          setInfoMessage("Enter the 6-digit code from your Authenticator app.");
          return;
        }

        localStorage.setItem("rks_token", data.data.token);
        if (data.data.user.role === "ADMIN") {
          localStorage.setItem("rks_admin_token", data.data.token);
        }
        if (onSuccess) onSuccess(data.data.user);
        onClose();
      } else if (mode === "REGISTER") {
        const res = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone, role: "BUYER" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        localStorage.setItem("rks_token", data.data.token);
        if (onSuccess) onSuccess(data.data.user);
        onClose();
      } else if (mode === "FORGOT") {
        const res = await fetch("/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Request failed");
        setInfoMessage(data.message);
      }
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass relative w-full max-w-md rounded-3xl border border-white/15 bg-ink-900/95 p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 shadow-md shadow-gold-500/25 mb-3">
            <Lock className="h-5 w-5 text-ink-950" />
          </div>
          <h2 className="font-display text-2xl text-white">
            {mode === "LOGIN" && "Sign In to RKS"}
            {mode === "REGISTER" && "Create an Account"}
            {mode === "FORGOT" && "Reset Password"}
            {mode === "MFA" && "Two-Factor Verification"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {mode === "LOGIN" && "Access your saved properties and scheduled site visits"}
            {mode === "REGISTER" && "Join 2,400+ families buying verified properties"}
            {mode === "FORGOT" && "Enter your email to receive recovery instructions"}
            {mode === "MFA" && "Enter the 6-digit code from your authenticator app"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "REGISTER" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Priya Menon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          )}

          {mode !== "MFA" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          )}

          {mode === "REGISTER" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          )}

          {(mode === "LOGIN" || mode === "REGISTER") && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {mode === "LOGIN" && (
                  <button
                    type="button"
                    onClick={() => { setMode("FORGOT"); setError(null); }}
                    className="text-[11px] text-gold-400 hover:text-gold-300"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          )}

          {mode === "MFA" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                autoFocus
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-center font-mono text-lg tracking-widest text-gold-300 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 py-3 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition disabled:opacity-50 mt-2"
          >
            {loading && "Please wait…"}
            {!loading && mode === "LOGIN" && "Sign In"}
            {!loading && mode === "REGISTER" && "Create Account"}
            {!loading && mode === "FORGOT" && "Send Reset Instructions"}
            {!loading && mode === "MFA" && "Verify Code & Proceed"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          {mode === "LOGIN" && (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => { setMode("REGISTER"); setError(null); }}
                className="font-semibold text-gold-400 hover:text-gold-300"
              >
                Sign up
              </button>
            </p>
          )}

          {mode === "REGISTER" && (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("LOGIN"); setError(null); }}
                className="font-semibold text-gold-400 hover:text-gold-300"
              >
                Sign in
              </button>
            </p>
          )}

          {(mode === "FORGOT" || mode === "MFA") && (
            <button
              onClick={() => { setMode("LOGIN"); setError(null); }}
              className="font-semibold text-gold-400 hover:text-gold-300"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
