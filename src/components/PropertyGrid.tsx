import React from "react";
import { Filter, SlidersHorizontal, Loader2, ShieldAlert } from "lucide-react";
import { Property, PropertyFilter, PropertyType } from "../types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  onBookVisit: (property: Property) => void;
  onInquire: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading,
  filters,
  onFilterChange,
  onBookVisit,
  onInquire,
}) => {
  return (
    <section id="properties" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-widest mb-2">
            <Filter className="w-4 h-4" />
            <span>Curated Inventory</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Verified Plots, Villas & Apartments
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Browse through 100% legally audited real estate options across Bengaluru.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(["", "PLOT", "VILLA", "APARTMENT"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => onFilterChange({ ...filters, type })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filters.type === type
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {type === "" ? "All Properties" : type === "PLOT" ? "Plots & Land" : type + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-sm font-medium">Fetching verified properties from backend API...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 px-6 text-center bg-slate-900/60 border border-slate-800 rounded-3xl max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Properties Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No properties match your current search criteria. Try clearing filters.
          </p>
          <button
            onClick={() => onFilterChange({})}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onBookVisit={onBookVisit}
              onInquire={onInquire}
            />
          ))}
        </div>
      )}
    </section>
  );
};
