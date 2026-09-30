import { useState, useMemo } from "react";
import {
  Home, Plus, Upload, Download, Search, Trash2, ExternalLink,
  Edit, CheckCircle2, AlertCircle, FileText, MapPin, Tag,
} from "lucide-react";
import { useContent } from "../content/ContentContext";
import PropertyImporterModal, { ImportedProperty } from "./PropertyImporterModal";

export default function PropertiesManager() {
  const { content, updateAt } = useContent();
  const properties = content.showcase.properties || [];

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New property manual form state
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [newProp, setNewProp] = useState<ImportedProperty>({
    name: "",
    type: "Villas",
    location: "Bengaluru",
    price: "₹2.0 Cr",
    size: "2,500 sq.ft",
    beds: "4 BHK",
    tag: "Ready to move",
    img: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const types = useMemo(() => {
    const set = new Set(properties.map((p) => p.type));
    return ["ALL", ...Array.from(set)];
  }, [properties]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchType = selectedType === "ALL" || p.type.toLowerCase() === selectedType.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.beds.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [properties, search, selectedType]);

  const handleImport = (importedList: ImportedProperty[], mode: "APPEND" | "REPLACE") => {
    let nextList: any[] = [];
    if (mode === "APPEND") {
      nextList = [...properties, ...importedList];
    } else {
      nextList = [...importedList];
    }

    updateAt(["showcase", "properties"], nextList);
    showToast(`Successfully imported ${importedList.length} properties!`);
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const nextList = properties.filter((p) => p.name !== name);
      updateAt(["showcase", "properties"], nextList);
      showToast(`Deleted "${name}"`);
    }
  };

  const handleExportCSV = () => {
    if (properties.length === 0) return;
    const headers = "name,type,location,price,size,beds,tag,img\n";
    const rows = properties
      .map((p) =>
        `"${p.name.replace(/"/g, '""')}","${p.type}","${p.location.replace(/"/g, '""')}","${p.price}","${p.size}","${p.beds}","${p.tag}","${p.img}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rks_properties_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Properties exported to CSV!");
  };

  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.name.trim()) return;
    const nextList = [...properties, newProp];
    updateAt(["showcase", "properties"], nextList);
    setIsAddingSingle(false);
    setNewProp({
      name: "",
      type: "Villas",
      location: "Bengaluru",
      price: "₹2.0 Cr",
      size: "2,500 sq.ft",
      beds: "4 BHK",
      tag: "Ready to move",
      img: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    });
    showToast(`Created property "${newProp.name}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-ink-950/95 px-4 py-3 text-xs font-semibold text-emerald-400 shadow-2xl backdrop-blur-xl">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-bold text-gold-300 mb-2">
            <Home className="h-3.5 w-3.5" /> Catalog Management
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Properties Catalog ({properties.length})
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Bulk import from CSV / Excel spreadsheets, export listings, or add individual properties.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImporterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-4 py-2.5 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25"
          >
            <Upload className="h-4 w-4" />
            <span>Import Properties (CSV/JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddingSingle(!isAddingSingle)}
            className="inline-flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-3.5 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-400 hover:text-ink-950 transition"
          >
            <Plus className="h-4 w-4" />
            <span>{isAddingSingle ? "Cancel" : "Add Property"}</span>
          </button>
        </div>
      </div>

      {/* Manual Add Single Property Inline Form */}
      {isAddingSingle && (
        <form
          onSubmit={handleCreateSingle}
          className="rounded-3xl border border-gold-400/30 bg-gold-500/5 p-6 sm:p-8 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-gold-400" /> Add Single Property Listing
            </h3>
            <span className="text-xs text-slate-400">All fields appear live on the site</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Property Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Palm Villas"
                value={newProp.name}
                onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Type *</label>
              <input
                type="text"
                required
                placeholder="Villas / Plots / Apartments"
                value={newProp.type}
                onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarjapur Road, Bengaluru"
                value={newProp.location}
                onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Starting Price *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹2.1 Cr"
                value={newProp.price}
                onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Area / Size *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2,800 sq.ft"
                value={newProp.size}
                onChange={(e) => setNewProp({ ...newProp, size: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Configuration *</label>
              <input
                type="text"
                required
                placeholder="e.g. 4 BHK"
                value={newProp.beds}
                onChange={(e) => setNewProp({ ...newProp, beds: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Tag / Status</label>
              <input
                type="text"
                placeholder="e.g. Ready to move"
                value={newProp.tag}
                onChange={(e) => setNewProp({ ...newProp, tag: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-300 mb-1 block">Image URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={newProp.img}
                onChange={(e) => setNewProp({ ...newProp, img: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingSingle(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gold-400 px-5 py-2 text-xs font-bold text-ink-950 hover:bg-gold-300 transition"
            >
              Save & Add to Showcase
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedType === t
                  ? "bg-gold-400 text-ink-950 font-bold"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-ink-900/60 text-slate-400">
              <tr>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No properties match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const slug = encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, "-"));
                  return (
                    <tr key={p.name} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.img}
                            alt={p.name}
                            className="h-10 w-12 rounded-lg object-cover bg-ink-900 border border-white/10 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gold-400" />
                              {p.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold-300">
                          {p.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-white">{p.price}</td>

                      <td className="py-3 px-4 text-slate-300">
                        {p.beds} • {p.size}
                      </td>

                      <td className="py-3 px-4">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {p.tag}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`#/property/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition"
                            title="View public page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(p.name)}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete property"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Importer Modal */}
      <PropertyImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImport={handleImport}
        existingCount={properties.length}
      />
    </div>
  );
}
