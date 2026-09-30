import React from "react";
import { ShieldCheck, MapPin, Maximize2, Bed, Calendar, Phone } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  onBookVisit: (property: Property) => void;
  onInquire: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBookVisit,
  onInquire,
}) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col h-full shadow-xl hover:shadow-2xl hover:shadow-amber-500/5">
      {/* Property Image Header */}
      <div className="relative h-56 overflow-hidden bg-slate-950">
        <img
          src={property.heroImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />

        {/* Verification Tag */}
        {property.isTitleVerified && (
          <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-emerald-950 font-bold text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Title Verified</span>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 font-semibold text-xs px-3 py-1 rounded-full border border-slate-700 uppercase tracking-wider">
          {property.type}
        </div>

        {/* Location & Title overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center space-x-1 text-slate-300 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-amber-300 transition-colors">
            {property.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{property.areaSqFt.toLocaleString()} sq.ft</span>
          </div>
          {property.bedrooms ? (
            <div className="flex items-center space-x-2">
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>{property.bedrooms} BHK</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{property.facing || "East"} Facing</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Total Price</p>
            <p className="text-xl font-extrabold text-amber-400">{formatPrice(property.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-medium">Rate / sq.ft</p>
            <p className="text-xs font-semibold text-slate-200">₹{property.pricePerSqFt.toLocaleString()}/sqft</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onBookVisit(property)}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-amber-500/10"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
          <button
            onClick={() => onInquire(property)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
