import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, MessageSquare, CalendarCheck, FileText,
  TrendingUp, Clock, UserPlus, ArrowUpRight,
} from "lucide-react";

interface DashboardOverviewProps {
  stats: any;
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ stats, onNavigate }: DashboardOverviewProps) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Properties",
      value: stats.totalProperties ?? 0,
      icon: FileText,
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
      iconColor: "text-blue-400",
      tab: "content",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads ?? 0,
      sub: `${stats.newLeads ?? 0} new`,
      icon: MessageSquare,
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
      iconColor: "text-emerald-400",
      tab: "leads",
    },
    {
      label: "Site Visits",
      value: stats.totalSiteVisits ?? 0,
      sub: `${stats.pendingSiteVisits ?? 0} pending`,
      icon: CalendarCheck,
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
      iconColor: "text-amber-400",
      tab: "visits",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers ?? 0,
      icon: Users,
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
      iconColor: "text-purple-400",
      tab: "users",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onNavigate(c.tab)}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left transition hover:scale-[1.02] ${c.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{c.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">{c.value}</p>
                  {c.sub && <p className="mt-1 text-xs text-slate-400">{c.sub}</p>}
                </div>
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 ${c.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => onNavigate("leads")}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-emerald-500/40 hover:bg-emerald-500/5"
          >
            <MessageSquare className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Review New Leads</p>
              <p className="text-xs text-slate-500">{stats.newLeads ?? 0} awaiting response</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate("visits")}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-amber-500/40 hover:bg-amber-500/5"
          >
            <Clock className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Pending Site Visits</p>
              <p className="text-xs text-slate-500">{stats.pendingSiteVisits ?? 0} to confirm</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate("content")}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-blue-500/40 hover:bg-blue-500/5"
          >
            <FileText className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Edit Website Content</p>
              <p className="text-xs text-slate-500">Update landing page sections</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
