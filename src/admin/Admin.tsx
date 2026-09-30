import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Navigation, Sparkles, BarChart3, Grid3X3, Home, ListOrdered,
  MessageSquareQuote, BadgeIndianRupee, HelpCircle, Send, PanelBottom, ExternalLink,
  Download, Upload, RotateCcw, CheckCircle2, Menu, X, Save,
  Users, MessageSquare, CalendarCheck, FileText, ShieldCheck,
} from "lucide-react";
import { useContent } from "../content/ContentContext";
import type { SiteContent } from "../content/defaultContent";
import { ObjectFields } from "./fields";
import { cn } from "../utils/cn";
import { useAdminAuth, useAdminData } from "./api";
import AdminLogin from "./AdminLogin";
import DashboardOverview from "./DashboardOverview";
import LeadsManager from "./LeadsManager";
import VisitsManager from "./VisitsManager";
import UsersManager from "./UsersManager";
import AuditLogsViewer from "./AuditLogsViewer";
import MfaSetupModal from "./MfaSetupModal";
import PropertiesManager from "./PropertiesManager";

/* ─── Content editor section list ─── */
const CONTENT_SECTIONS: { key: keyof SiteContent; label: string; icon: typeof Home; desc: string }[] = [
  { key: "brand", label: "Brand & Contact", icon: LayoutDashboard, desc: "Business name, phone, email and address used across the site." },
  { key: "nav", label: "Navigation", icon: Navigation, desc: "Menu links shown in the top navigation bar." },
  { key: "hero", label: "Hero", icon: Sparkles, desc: "The big opening section — headline, buttons, image and floating cards." },
  { key: "socialProof", label: "Stats & Partners", icon: BarChart3, desc: "Animated counters and the scrolling partner logos strip." },
  { key: "features", label: "Features", icon: Grid3X3, desc: "The six 'Why RKS' cards." },
  { key: "showcase", label: "Properties", icon: Home, desc: "Property listings. Category tabs are generated automatically from each listing's Type." },
  { key: "process", label: "Process", icon: ListOrdered, desc: "The four buying steps and the timeline stat card." },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote, desc: "Client stories and reviews." },
  { key: "pricing", label: "Pricing", icon: BadgeIndianRupee, desc: "Fee plans. 'Land Price/Note' fields are shown when the Land buyers toggle is active." },
  { key: "faq", label: "FAQ", icon: HelpCircle, desc: "Frequently asked questions accordion." },
  { key: "contact", label: "Contact & CTA", icon: Send, desc: "The lead-capture form section, dropdown options and success message." },
  { key: "footer", label: "Footer", icon: PanelBottom, desc: "About text, link columns, newsletter and legal links." },
];

type Tab = "properties" | "content" | "dashboard" | "leads" | "visits" | "users" | "audit";

export default function Admin() {
  const { content, updateAt, importJson, reset, savedAt, saveToBackend, syncing } = useContent();
  const { user, login, logout, isAuthed } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [activeContentSection, setActiveContentSection] = useState<keyof SiteContent>("brand");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Data fetching
  const dashboard = useAdminData<any>("/admin/dashboard", [activeTab]);
  const leads = useAdminData<any[]>("/admin/leads", [activeTab]);
  const visits = useAdminData<any[]>("/admin/site-visits", [activeTab]);
  const users = useAdminData<any[]>("/admin/users", [activeTab]);
  const auditLogs = useAdminData<any[]>("/admin/audit-logs", [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab, activeContentSection]);

  if (!isAuthed) return <AdminLogin onLogin={login} />;

  const handleSaveDatabase = async () => {
    const ok = await saveToBackend();
    setToast(ok ? "All changes saved to database!" : "Saved locally");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rks-site-content.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Content exported to JSON");
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJson(String(reader.result));
      setToast(ok ? "Content imported successfully" : "Invalid JSON file");
    };
    reader.readAsText(file);
  };

  const TABS: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "properties", label: "Properties & Import", icon: Home, badge: content.showcase.properties.length },
    { key: "content", label: "Edit Website", icon: FileText },
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "leads", label: "Leads", icon: MessageSquare, badge: dashboard.data?.newLeads },
    { key: "visits", label: "Site Visits", icon: CalendarCheck, badge: dashboard.data?.pendingSiteVisits },
    { key: "users", label: "Users", icon: Users },
    { key: "audit", label: "Security Audit Logs", icon: ShieldCheck },
  ];

  const contentSection = CONTENT_SECTIONS.find((s) => s.key === activeContentSection)!;

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 text-xs font-black text-ink-950">
            R
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">RKS Admin Dashboard</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Logged in as {user?.name || "Admin"} ({user?.email})
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowMfaModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs font-semibold text-gold-300 transition hover:bg-gold-400 hover:text-ink-950"
              title="Configure Two-Factor Authentication"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">2FA Security</span>
            </button>

            {activeTab === "content" && (
              <>
                <button
                  onClick={handleSaveDatabase}
                  disabled={syncing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50"
                  title="Save current edits to the backend database"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{syncing ? "Saving…" : "Save to Database"}</span>
                </button>
                <button
                  onClick={exportJson}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-gold-400/40 hover:text-gold-300"
                >
                  <Download className="h-3.5 w-3.5" /> <span>Export</span>
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-gold-400/40 hover:text-gold-300"
                >
                  <Upload className="h-3.5 w-3.5" /> <span>Import</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])}
                />
              </>
            )}
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-gold-300 to-gold-600 px-3.5 py-2 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/30"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-72 overflow-y-auto border-r border-white/10 bg-ink-900 p-4 pt-20 transition-transform lg:sticky lg:top-[73px] lg:z-0 lg:h-[calc(100vh-73px)] lg:w-60 lg:shrink-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-2",
            menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <nav aria-label="Admin sections" className="space-y-1">
            {TABS.map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setMenuOpen(false); }}
                aria-current={activeTab === key ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                  activeTab === key
                    ? "bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Content sub-sections (only when Edit Website tab is active) */}
          {activeTab === "content" && (
            <div className="mt-6 border-t border-white/10 pt-4 space-y-1">
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gold-400/70">
                Page Sections to Edit
              </p>
              {CONTENT_SECTIONS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveContentSection(key); setMenuOpen(false); }}
                  aria-current={activeContentSection === key ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium transition",
                    activeContentSection === key
                      ? "bg-gold-400/10 text-gold-300 border border-gold-400/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </button>
              ))}
              <div className="pt-3">
                <button
                  onClick={() => {
                    if (confirm("Reset ALL content to the original defaults? This cannot be undone.")) {
                      reset();
                      setToast("Content reset to defaults");
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-300/80 transition hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset to defaults
                </button>
              </div>
            </div>
          )}
        </aside>

        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          />
        )}

        {/* Main panel */}
        <main className="min-w-0 flex-1 pb-24">
          <motion.div
            key={activeTab + (activeTab === "content" ? activeContentSection : "")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "properties" && <PropertiesManager />}

            {activeTab === "content" && (
              <>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl text-white">{contentSection.label}</h1>
                    <p className="mt-1 text-sm text-slate-400">{contentSection.desc}</p>
                  </div>
                  <button
                    onClick={handleSaveDatabase}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 shrink-0 self-start sm:self-auto"
                  >
                    <Save className="h-4 w-4" />
                    <span>{syncing ? "Saving to Database…" : "Save to Database"}</span>
                  </button>
                </div>

                {activeContentSection === "showcase" && (
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gold-400/30 bg-gold-400/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-400">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Bulk Property Importer & Manager Available</p>
                        <p className="text-xs text-slate-300">
                          Upload your listings via CSV (Excel / Sheets) or JSON with automatic column detection and live preview.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("properties")}
                      className="inline-flex items-center gap-2 rounded-xl bg-gold-400 px-4 py-2 text-xs font-bold text-ink-950 shadow-md shadow-gold-400/20 transition hover:bg-gold-300 shrink-0"
                    >
                      <Home className="h-4 w-4" />
                      Open Properties & Importer
                    </button>
                  </div>
                )}
                <div className="glass space-y-5 rounded-3xl p-5 sm:p-7">
                  <ObjectFields value={content[activeContentSection]} path={[activeContentSection]} onChange={updateAt} />
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Changes update the live website immediately. Click <strong className="text-emerald-400">Save to Database</strong> to store your changes in the cloud.
                </p>
              </>
            )}

            {activeTab === "dashboard" && (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl text-white">Dashboard</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Overview of your real estate platform activity.
                  </p>
                </div>
                <DashboardOverview stats={dashboard.data} onNavigate={(t) => setActiveTab(t as Tab)} />
              </>
            )}

            {activeTab === "leads" && (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl text-white">Lead Inquiries</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage incoming inquiries from potential buyers. Update status as you follow up.
                  </p>
                </div>
                <LeadsManager leads={leads.data} loading={leads.loading} onRefresh={leads.refresh} />
              </>
            )}

            {activeTab === "visits" && (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl text-white">Site Visit Bookings</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Confirm or reschedule property site visits booked by prospective buyers.
                  </p>
                </div>
                <VisitsManager visits={visits.data} loading={visits.loading} onRefresh={visits.refresh} />
              </>
            )}

            {activeTab === "users" && (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl text-white">User Management</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    View all registered users. Change roles or remove accounts.
                  </p>
                </div>
                <UsersManager
                  users={users.data}
                  loading={users.loading}
                  currentUserId={user?.id}
                  onRefresh={users.refresh}
                />
              </>
            )}

            {activeTab === "audit" && (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl text-white">Security Audit Trail</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Immutable log of all authentication attempts, privilege elevations, document uploads, and security events.
                  </p>
                </div>
                <AuditLogsViewer
                  logs={auditLogs.data}
                  loading={auditLogs.loading}
                  onRefresh={auditLogs.refresh}
                />
              </>
            )}
          </motion.div>
        </main>
      </div>

      {/* MFA Modal */}
      <MfaSetupModal
        isOpen={showMfaModal}
        onClose={() => setShowMfaModal(false)}
        onSuccess={() => setToast("2FA successfully enabled!")}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-bold text-ink-950 shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
