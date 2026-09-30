import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, MapPin, IndianRupee, Bed, Maximize2,
  ShieldCheck, ArrowRight, ArrowLeft, Filter, Sparkles, Scale,
} from "lucide-react";
import { Container, Eyebrow } from "../components/ui";
import { useContent } from "../content/ContentContext";
import { useCompare } from "../content/CompareContext";
import { cn } from "../utils/cn";

export default function PropertiesPage() {
  const { content } = useContent();
  const { toggleCompare, isInCompare } = useCompare();
  const allProperties = content.showcase.properties;

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [priceSort, setPriceSort] = useState<"NONE" | "LOW_TO_HIGH" | "HIGH_TO_LOW">("NONE");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Available types extracted dynamically
  const types = useMemo(() => {
    const set = new Set(allProperties.map((p) => p.type));
    return ["ALL", ...Array.from(set)];
  }, [allProperties]);

  // Filtered and sorted listings
  const filtered = useMemo(() => {
    return allProperties
      .filter((p) => {
        const matchesType = selectedType === "ALL" || p.type.toLowerCase() === selectedType.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()) ||
          p.beds.toLowerCase().includes(search.toLowerCase());
        const matchesVerified = verifiedOnly ? (p as any).isTitleVerified !== false : true;
        return matchesType && matchesSearch && matchesVerified;
      })
      .sort((a, b) => {
        if (priceSort === "NONE") return 0;
        // Parse approximate rupee price
        const parsePrice = (str: string) => {
          if (str.includes("Cr")) return parseFloat(str.replace(/[^0-9.]/g, "")) * 100;
          if (str.includes("L")) return parseFloat(str.replace(/[^0-9.]/g, ""));
          return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
        };
        const pa = parsePrice(a.price);
        const pb = parsePrice(b.price);
        return priceSort === "LOW_TO_HIGH" ? pa - pb : pb - pa;
      });
  }, [allProperties, search, selectedType, priceSort, verifiedOnly]);

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-24 text-slate-200">
      <Container>
        {/* Navigation & Header */}
        <div className="mb-8">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </a>
          <Eyebrow>Verified Inventory</Eyebrow>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-white">
            Explore Curated Properties
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-400">
            Every plot, villa, and home has completed our in-house 42-point legal audit with 100% clear titles.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass mb-10 space-y-4 rounded-3xl p-5 sm:p-7 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by project name, zone (Whitefield, Sarjapur, Hebbal), or BHK…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            {/* Price Sorter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 focus:border-gold-400/60 focus:outline-none"
              >
                <option value="NONE" className="bg-ink-900">Sort by Price: Default</option>
                <option value="LOW_TO_HIGH" className="bg-ink-900">Price: Low to High</option>
                <option value="HIGH_TO_LOW" className="bg-ink-900">Price: High to Low</option>
              </select>

              <button
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold transition ${
                  verifiedOnly
                    ? "bg-gold-400/15 border-gold-400/40 text-gold-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Title Verified Only</span>
              </button>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Category:</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedType === t
                    ? "bg-gradient-to-r from-gold-300 to-gold-600 text-ink-950 shadow-md shadow-gold-500/25"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/20"
                }`}
              >
                {t === "ALL" ? "All Properties" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center glass rounded-3xl border border-white/10">
            <Search className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-semibold text-white">No properties match your filter</h3>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search terms or property type selection.</p>
            <button
              onClick={() => { setSearch(""); setSelectedType("ALL"); setPriceSort("NONE"); setVerifiedOnly(false); }}
              className="mt-4 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-bold text-gold-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => {
              const slug = (item.name || `property-${i}`).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `property-${i}`;
              return (
                <motion.article
                  key={item.name + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-gold-400/40 hover:bg-white/[0.04] hover:-translate-y-1"
                >
                  {/* Photo with Tag */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-full bg-ink-950/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                        {item.type}
                      </span>
                      {item.tag && (
                        <span className="rounded-full bg-gold-400/90 px-3 py-1 text-[11px] font-bold text-ink-950">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCompare(item);
                      }}
                      aria-label="Compare property"
                      title={isInCompare(item.name) ? "Remove from comparison" : "Add to comparison"}
                      className={cn(
                        "absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur transition-all",
                        isInCompare(item.name)
                          ? "bg-gold-400 text-ink-950 shadow-md shadow-gold-500/30"
                          : "bg-ink-950/80 text-slate-200 hover:bg-gold-400 hover:text-ink-950 border border-white/15"
                      )}
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isInCompare(item.name) ? "Comparing" : "Compare"}
                      </span>
                    </button>
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-ink-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <ShieldCheck className="h-3.5 w-3.5" /> 42-Pt Title Verified
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-2xl font-bold text-white">
                        {item.price}
                      </span>
                      <span className="text-xs text-slate-400">All-incl. price sheet</span>
                    </div>

                    <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-gold-300 transition">
                      {item.name}
                    </h2>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                      {item.location}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                        {item.size}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-3.5 w-3.5 text-slate-400" />
                        {item.beds}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 pt-3 flex items-center gap-2">
                      <a
                        href={`#/property/${slug}`}
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-gold-400 hover:text-ink-950 hover:border-gold-400"
                      >
                        View Details
                      </a>
                      <a
                        href="#contact"
                        className="rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-4 py-2.5 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25"
                      >
                        Book Visit
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
