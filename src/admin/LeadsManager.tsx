import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Phone, Mail, MapPin, Clock, CheckCircle2,
  UserCheck, XCircle, ChevronDown, Loader2,
} from "lucide-react";
import { adminPatch } from "./api";
import { cn } from "../utils/cn";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  NEW: { label: "New", color: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: MessageSquare },
  CONTACTED: { label: "Contacted", color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Phone },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: Clock },
  CLOSED: { label: "Closed", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
};

interface LeadsManagerProps {
  leads: any[] | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function LeadsManager({ leads, loading, onRefresh }: LeadsManagerProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = leads
    ? filter === "ALL"
      ? leads
      : leads.filter((l: any) => l.status === filter)
    : [];

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminPatch(`/admin/leads/${id}/status`, { status });
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
        {["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"].map((s) => (
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
            {s === "ALL" ? "All Leads" : STATUS_CONFIG[s]?.label || s}
            {s !== "ALL" && leads && (
              <span className="ml-1.5 opacity-60">
                ({leads.filter((l: any) => l.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold-400" />
          <p className="mt-2 text-sm text-slate-400">Loading leads…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center glass rounded-2xl">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No leads found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((lead: any) => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-white truncate">{lead.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-gold-400" /> {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-gold-400" /> {lead.phone}
                        </span>
                        {lead.interestedIn && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gold-400" /> {lead.interestedIn}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">{lead.message}</p>

                      {lead.property && (
                        <p className="text-xs text-slate-500">
                          Property: <span className="text-slate-300">{lead.property.title}</span>
                          {lead.property.price && ` · ₹${Number(lead.property.price).toLocaleString("en-IN")}`}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-600">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Status changer */}
                    <div className="shrink-0">
                      <select
                        value={lead.status}
                        onChange={(e) => changeStatus(lead.id, e.target.value)}
                        disabled={updating === lead.id}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-gold-400/60 focus:outline-none disabled:opacity-50"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CLOSED">Closed</option>
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
