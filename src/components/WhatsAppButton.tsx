import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useContent } from "../content/ContentContext";

export default function WhatsAppButton() {
  const { content } = useContent();
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || "");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Show tooltip after 3 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Determine context-aware WhatsApp prefilled message
  let message = "Hi RKS Team, I would like to schedule a free property consultation and site visit in Bengaluru.";
  const phone = content.brand.phone.replace(/[^\d]/g, "") || "919876543210";
  const intlPhone = phone.startsWith("91") ? phone : `91${phone}`;

  if (currentHash.startsWith("#/property/")) {
    const slug = currentHash.replace("#/property/", "").split("?")[0];
    const properties = content.showcase.properties;
    const found = properties.find(
      (p) => encodeURIComponent(p.name.toLowerCase().replace(/\s+/g, "-")) === slug
    );
    if (found) {
      message = `Hi RKS Team, I am interested in inspecting ${found.name} in ${found.location} (Starting ${found.price}). Can you please share the latest pricing sheet and legal title report?`;
    }
  } else if (currentHash.startsWith("#/valuation")) {
    message = "Hi RKS Team, I want to get an accurate market valuation for selling my property in Bengaluru.";
  } else if (currentHash.startsWith("#/calculator")) {
    message = "Hi RKS Team, I used your EMI Calculator and want to check bank loan pre-approvals (SBI, HDFC, ICICI).";
  }

  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Interactive Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            className="glass relative rounded-2xl border border-emerald-500/30 bg-ink-950/95 py-2 px-3.5 shadow-2xl shadow-black/80 hidden sm:flex items-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs">
              <p className="font-semibold text-white">Chat with an Advisor</p>
              <p className="text-[10px] text-emerald-400">Online • Instant response</p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              aria-label="Dismiss tooltip"
              className="ml-1 text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Property Advisor on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400/40 transition-all hover:shadow-emerald-500/40 focus:outline-none"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border border-ink-950" />
        </span>
        <MessageCircle className="h-6 w-6 text-white drop-shadow" />
      </motion.a>
    </div>
  );
}
