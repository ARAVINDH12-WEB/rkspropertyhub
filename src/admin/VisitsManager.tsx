import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle, MapPin,
  User, Phone, Mail, Loader2, Calendar,
} from "lucide-react";
import { adminPatch } from "./api";
import { cn } from "../utils/cn";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: CalendarCheck },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/15 text-rose-300 border-rose-500/30", icon: XCircle },
};

interface VisitsManagerProps {
  visits: any[] | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function VisitsManager({ visits, loading, onRefresh }: VisitsManagerProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = visits
    ? filter === "ALL"
      ? visits
      : visits.filter((v: any) => v.status === filter)
    : [];

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminPatch(`/site-visits/${id}/status`, { status });
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition",
              filter === s
                ? "bg-gold-400 text-ink-950"
                : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/20"
            )}
          >
            {s === "ALL" ? "All Visits" : STATUS_CONFIG[s]?.label || s}
            {s !== "ALL" && visits && (
              <span className="ml-1.5 opacity-60">
                ({visits.filter((v: any) => v.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-400" />
          <p className="mt-2 text-sm text-slate-400">Loading site visits…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center glass rounded-2xl">
          <Calendar className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No site visits found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((visit: any) => {
              const cfg = STATUS_CONFIG[visit.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={visit.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-white truncate">{visit.visitorName}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-gold-400" /> {visit.visitorEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-gold-400" /> {visit.visitorPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gold-400" />
                          {new Date(visit.visitDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gold-400" /> {visit.timeSlot}
                        </span>
                      </div>

                      {visit.property && (
                        <p className="text-xs text-slate-500">
                          Property: <span className="text-slate-300">{visit.property.title}</span>
                          {visit.property.location && ` · ${visit.property.location}`}
                        </p>
                      )}

                      {visit.notes && (
                        <p className="text-sm text-slate-400 italic">"{visit.notes}"</p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <select
                        value={visit.status}
                        onChange={(e) => changeStatus(visit.id, e.target.value)}
                        disabled={updating === visit.id}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
