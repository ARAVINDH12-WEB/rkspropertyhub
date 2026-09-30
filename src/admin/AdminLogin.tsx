import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, LayoutDashboard } from "lucide-react";
import { cn } from "../utils/cn";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("admin@rksrealty.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-5">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 shadow-lg shadow-gold-500/30">
          <LayoutDashboard className="h-6 w-6 text-ink-950" />
        </div>
        <h1 className="mt-5 font-display text-2xl text-white">RKS Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in with your admin credentials to manage your site.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rksrealty.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="Enter password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 py-3 font-semibold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/30 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In to Dashboard"}
        </button>
        <p className="mt-4 text-xs text-slate-500">Default: admin@rksrealty.com / password123</p>
        <a
          href="#top"
          onClick={() => (location.hash = "")}
          className="mt-3 inline-block text-xs text-slate-400 underline underline-offset-2 hover:text-gold-300"
        >
          ← Back to website
        </a>
      </motion.form>
    </div>
  );
}
