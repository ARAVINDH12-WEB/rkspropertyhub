import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Key, CheckCircle2, Loader2 } from "lucide-react";

interface MfaSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MfaSetupModal({ isOpen, onClose, onSuccess }: MfaSetupModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    const authToken = localStorage.getItem("rks_admin_token") || localStorage.getItem("rks_token") || "";

    fetch("/api/v1/auth/mfa/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setQrCodeUrl(data.data.qrCodeUrl);
          setSecret(data.data.secret);
        } else {
          setError(data.message || "Failed to initiate MFA setup");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    const authToken = localStorage.getItem("rks_admin_token") || localStorage.getItem("rks_token") || "";

    try {
      const res = await fetch("/api/v1/auth/mfa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "MFA verification failed");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass relative w-full max-w-md rounded-3xl border border-white/15 bg-ink-900/95 p-6 sm:p-8 shadow-2xl text-center"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-300 mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="font-display text-2xl text-white">Enable Two-Factor Authentication</h3>
        <p className="mt-1 text-xs text-slate-400">
          Scan the QR code with Google Authenticator, 1Password, or Authy.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold-400" />
            <p className="mt-2 text-xs text-slate-400">Generating secure cryptographic key…</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {qrCodeUrl && (
              <div className="mx-auto w-48 h-48 rounded-2xl overflow-hidden border border-white/15 bg-white p-3 shadow-lg">
                <img src={qrCodeUrl} alt="TOTP QR Code" className="w-full h-full object-contain" />
              </div>
            )}

            {secret && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Manual Setup Key</p>
                <code className="text-xs font-mono text-gold-300 select-all">{secret}</code>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-3 pt-2">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center font-mono text-lg tracking-widest text-gold-300 focus:border-gold-400/60 focus:outline-none"
              />

              <button
                type="submit"
                disabled={verifying || token.length !== 6}
                className="w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 py-3 text-xs font-bold text-ink-950 shadow-md shadow-gold-500/20 hover:shadow-lg transition disabled:opacity-50"
              >
                {verifying ? "Verifying…" : "Confirm & Activate 2FA"}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
