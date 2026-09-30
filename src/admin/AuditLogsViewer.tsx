import { useState } from "react";
import { ShieldCheck, AlertTriangle, Key, User, Clock, Loader2, Search } from "lucide-react";
import { cn } from "../utils/cn";

interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  ip?: string;
  userAgent?: string;
  details?: string;
  createdAt: string;
  user?: { id: string; name: string; email: string; role: string };
}

interface AuditLogsViewerProps {
  logs: AuditLogEntry[] | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AuditLogsViewer({ logs, loading, onRefresh }: AuditLogsViewerProps) {
  const [search, setSearch] = useState("");

  const filtered = (logs || []).filter((l) => {
    return (
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.user?.email && l.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (l.ip && l.ip.includes(search))
    );
  });

  const getActionBadge = (action: string) => {
    if (action.includes("LOCKOUT") || action.includes("MISMATCH") || action.includes("FAILED")) {
      return "bg-rose-500/15 border-rose-500/30 text-rose-300";
    }
    if (action.includes("SUCCESS") || action.includes("MFA_ENABLED")) {
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
    }
    return "bg-blue-500/15 border-blue-500/30 text-blue-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative min-w-[260px] max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search action, email, or IP address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
          />
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 shrink-0"
        >
          Refresh Logs
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-400" />
          <p className="mt-2 text-sm text-slate-400">Loading audit trail…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center glass rounded-2xl">
          <ShieldCheck className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No security audit logs found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden md:table-cell">IP & Client</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Details</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-slate-300 font-sans">
                    {log.user ? (
                      <div>
                        <p className="font-semibold text-white">{log.user.name}</p>
                        <p className="text-[11px] text-slate-400">{log.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unauthenticated</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-slate-400">
                    <p>{log.ip || "127.0.0.1"}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-400 max-w-xs truncate">
                    {log.details ? (
                      <span className="text-slate-300">{log.details}</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-400 font-sans">
                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
