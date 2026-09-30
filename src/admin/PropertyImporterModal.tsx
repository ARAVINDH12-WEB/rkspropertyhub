import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, FileText, CheckCircle2, AlertCircle, Download,
  Layers, RefreshCw, Plus, Check, ArrowRight, SlidersHorizontal,
  ChevronDown, HelpCircle,
} from "lucide-react";

export interface ImportedProperty {
  type: string;
  name: string;
  location: string;
  price: string;
  size: string;
  beds: string;
  tag: string;
  img: string;
}

interface PropertyImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (properties: ImportedProperty[], mode: "APPEND" | "REPLACE") => void;
  existingCount: number;
}

interface ColumnMapping {
  name: string;
  type: string;
  location: string;
  price: string;
  size: string;
  beds: string;
  tag: string;
  img: string;
}

const DEFAULT_IMG =
  "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000";

// Robust CSV row parser supporting quoted strings, commas, and custom delimiters
function parseCSVRows(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const cleaned = text.replace(/^\uFEFF/, "").trim();
  if (!cleaned) return { headers: [], rows: [] };

  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Detect delimiter: comma, semicolon, tab
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const delimiter = tabCount > commaCount && tabCount > semiCount ? "\t" : semiCount > commaCount ? ";" : ",";

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ""));
    return result;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map((h, i) => h.trim() || `Column_${i + 1}`);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || values.every((v) => !v)) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx].trim() : "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

// Auto-detect which CSV column matches which property field
function autoGuessMapping(headers: string[]): ColumnMapping {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const findMatch = (candidates: string[]): string => {
    // 1. Exact normalized match
    for (const c of candidates) {
      const exact = headers.find((h) => norm(h) === c);
      if (exact) return exact;
    }
    // 2. Starts with / includes match
    for (const c of candidates) {
      const partial = headers.find((h) => norm(h).includes(c));
      if (partial) return partial;
    }
    return "";
  };

  return {
    name: findMatch(["name", "title", "propertyname", "projectname", "project", "property", "listing"]),
    type: findMatch(["type", "propertytype", "category", "listingtype", "proptype"]),
    // Notice: "area" is intentionally excluded from location so it never conflicts with Size/Area
    location: findMatch(["location", "locality", "address", "city", "place", "zone", "neighborhood", "landmark"]),
    price: findMatch(["price", "cost", "startingprice", "rate", "budget", "amount", "totalprice", "value"]),
    size: findMatch(["size", "area", "areasqft", "sqft", "carpetarea", "builtuparea", "superbuiltuparea", "plotarea", "dimension", "dimensions", "squarefeet"]),
    beds: findMatch(["beds", "bhk", "bedrooms", "bedroom", "configuration", "config", "rooms"]),
    tag: findMatch(["tag", "status", "possession", "label", "badge", "stage", "tags"]),
    img: findMatch(["img", "image", "photo", "imageurl", "heroimage", "photourl", "thumbnail", "picture", "url", "link"]),
  };
}

export default function PropertyImporterModal({
  isOpen,
  onClose,
  onImport,
  existingCount,
}: PropertyImporterModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"APPEND" | "REPLACE">("APPEND");
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: "",
    type: "",
    location: "",
    price: "",
    size: "",
    beds: "",
    tag: "",
    img: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute parsed properties from raw rows and column mapping
  const parsedProperties = useMemo<ImportedProperty[]>(() => {
    if (rawRows.length === 0) return [];

    return rawRows
      .map((row, idx) => {
        const name = (columnMapping.name ? row[columnMapping.name] : "") || `Property ${idx + 1}`;
        const type = (columnMapping.type ? row[columnMapping.type] : "") || "Villas";
        const location = columnMapping.location ? row[columnMapping.location] : "";
        const price = columnMapping.price ? row[columnMapping.price] : "";
        const size = columnMapping.size ? row[columnMapping.size] : "";
        const beds = columnMapping.beds ? row[columnMapping.beds] : "";
        const tag = columnMapping.tag ? row[columnMapping.tag] : "";
        const img = (columnMapping.img ? row[columnMapping.img] : "") || DEFAULT_IMG;

        return {
          name: name.trim(),
          type: type.trim() || "Villas",
          location: location.trim(),
          price: price.trim(),
          size: size.trim(),
          beds: beds.trim(),
          tag: tag.trim(),
          img: img.trim() || DEFAULT_IMG,
        };
      })
      .filter((p) => p.name.length > 0);
  }, [rawRows, columnMapping]);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();

    if (file.name.endsWith(".json")) {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed) ? parsed : parsed.properties || parsed.showcase?.properties || [];
          if (!Array.isArray(list) || list.length === 0) {
            throw new Error("No properties found in JSON file. Ensure it contains an array of properties.");
          }

          // Extract unique keys across all JSON items
          const keysSet = new Set<string>();
          list.forEach((item: any) => {
            if (item && typeof item === "object") {
              Object.keys(item).forEach((k) => keysSet.add(k));
            }
          });
          const headers = Array.from(keysSet);
          const rows = list.map((item: any) => {
            const row: Record<string, string> = {};
            headers.forEach((h) => {
              row[h] = item[h] !== undefined && item[h] !== null ? String(item[h]) : "";
            });
            return row;
          });

          const guessed = autoGuessMapping(headers);
          setRawHeaders(headers);
          setRawRows(rows);
          setColumnMapping(guessed);
        } catch (err: any) {
          setError(err.message || "Failed to parse JSON file");
          setRawHeaders([]);
          setRawRows([]);
        }
      };
      reader.readAsText(file);
    } else {
      // CSV or text file
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const { headers, rows } = parseCSVRows(content);
          if (rows.length === 0) {
            throw new Error("No valid property records found in CSV. Please verify column headers.");
          }
          const guessed = autoGuessMapping(headers);
          setRawHeaders(headers);
          setRawRows(rows);
          setColumnMapping(guessed);
        } catch (err: any) {
          setError(err.message || "Failed to parse CSV file");
          setRawHeaders([]);
          setRawRows([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "name,type,location,price,size,beds,tag,img\n" +
      '"The Oasis Duplex","Villas","Whitefield, Bengaluru","₹2.8 Cr","3,600 sq.ft","4 BHK","Ready to move","https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg"\n' +
      '"Silverwood Plots","Plots","Sarjapur Road","₹75 L","2,400 sq.ft","DTCP Approved","14% YoY","https://images.pexels.com/photos/16588337/pexels-photo-16588337.jpeg"\n' +
      '"Skyline Horizon","Apartments","Hebbal","₹1.4 Cr","1,850 sq.ft","3 BHK","Lake view","https://images.pexels.com/photos/4933643/pexels-photo-4933643.jpeg"';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "rks_properties_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (parsedProperties.length === 0) return;
    onImport(parsedProperties, mode);
    onClose();
  };

  const updateMapping = (field: keyof ColumnMapping, val: string) => {
    setColumnMapping((prev) => ({ ...prev, [field]: val }));
  };

  // Helper to get sample value for a column from row 1
  const getSample = (col: string): string => {
    if (!col || rawRows.length === 0) return "";
    return rawRows[0][col] || "";
  };

  const FIELDS: { key: keyof ColumnMapping; label: string; desc: string; required?: boolean }[] = [
    { key: "name", label: "Property Name", desc: "Title / Project name", required: true },
    { key: "location", label: "Location / Address", desc: "City, zone or street" },
    { key: "price", label: "Price", desc: "e.g. ₹2.4 Cr, ₹75 L, 8500000" },
    { key: "size", label: "Size / Area", desc: "e.g. 2,400 sq.ft, 1 Acre" },
    { key: "beds", label: "Bedrooms / BHK", desc: "e.g. 3 BHK, 4 BHK, DTCP" },
    { key: "type", label: "Category / Type", desc: "Villas, Apartments, Plots" },
    { key: "tag", label: "Status / Tag", desc: "e.g. Ready to move, New launch" },
    { key: "img", label: "Photo / Image URL", desc: "Web image link" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-ink-950 p-6 sm:p-8 shadow-2xl shadow-black/90 space-y-6 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 text-gold-300 border border-gold-400/20">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import Properties (CSV / JSON)</h3>
                <p className="text-xs text-slate-400">
                  Upload your spreadsheet, verify column mapping, and preview properties before importing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            {/* Template Download Prompt */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gold-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Need a Standard CSV Template?</p>
                  <p className="text-[11px] text-slate-400">
                    Expected columns: name, type, location, price, size, beds, tag, img
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-white/10 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download CSV Template</span>
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-3xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-gold-400 bg-gold-400/5 scale-[1.01]"
                  : "border-white/15 hover:border-gold-400/50 bg-white/[0.01]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-gold-400 mx-auto mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                {fileName ? fileName : "Click to select or drag & drop your CSV or JSON file"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Supports <span className="text-gold-300 font-semibold">.CSV</span> (Excel / Google Sheets) and <span className="text-gold-300 font-semibold">.JSON</span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 2: Column Mapping Selector */}
            {rawHeaders.length > 0 && (
              <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-400/20 pb-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gold-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Step 2: Map Your File's Columns
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Verify each property field matches the right column in your spreadsheet.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {FIELDS.map((f) => {
                    const mappedCol = columnMapping[f.key];
                    const sample = getSample(mappedCol);

                    return (
                      <div key={f.key} className="space-y-1.5 rounded-xl border border-white/10 bg-ink-900/60 p-3">
                        <div className="flex items-baseline justify-between">
                          <label className="text-[11px] font-bold text-white uppercase tracking-wider">
                            {f.label} {f.required && <span className="text-rose-400">*</span>}
                          </label>
                        </div>
                        <select
                          value={mappedCol}
                          onChange={(e) => updateMapping(f.key, e.target.value)}
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-gold-300 focus:border-gold-400 focus:outline-none"
                        >
                          <option value="" className="bg-ink-900 text-slate-400">
                            -- Skip / None --
                          </option>
                          {rawHeaders.map((h) => (
                            <option key={h} value={h} className="bg-ink-900 text-white">
                              {h}
                            </option>
                          ))}
                        </select>
                        {sample && (
                          <p className="text-[10px] text-slate-400 truncate" title={`Sample: "${sample}"`}>
                            Sample: <span className="text-slate-200 font-medium">"{sample}"</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedProperties.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Ready to Import: {parsedProperties.length} Properties Found
                    </h4>
                    <p className="text-[11px] text-slate-400">Review the mapped data below before confirming</p>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Mode:</span>
                    <button
                      onClick={() => setMode("APPEND")}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        mode === "APPEND"
                          ? "bg-gold-400 text-ink-950 shadow-md shadow-gold-500/20"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      Append (+{existingCount})
                    </button>
                    <button
                      onClick={() => setMode("REPLACE")}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        mode === "REPLACE"
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      Replace All
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.01]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-ink-900/90 sticky top-0 text-slate-400 z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Size / Area</th>
                        <th className="py-2.5 px-3">Beds / Config</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {parsedProperties.map((p, idx) => {
                        const cell = (val: string, cls: string) =>
                          val ? (
                            <td className={`py-2.5 px-3 ${cls}`}>{val}</td>
                          ) : (
                            <td className="py-2.5 px-3 text-slate-600 italic">—</td>
                          );

                        return (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-white truncate max-w-[160px]">{p.name}</td>
                            {cell(p.type, "text-gold-300")}
                            {cell(p.location, "text-slate-300 truncate max-w-[140px]")}
                            {cell(p.price, "font-semibold text-white")}
                            {cell(p.size, "text-slate-300")}
                            {cell(p.beds, "text-slate-400")}
                            {cell(p.tag, "text-emerald-400")}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmImport}
              disabled={parsedProperties.length === 0}
              className="rounded-xl bg-gradient-to-r from-gold-300 to-gold-600 px-6 py-2.5 text-xs font-bold text-ink-950 transition hover:shadow-lg hover:shadow-gold-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Confirm & Import ({parsedProperties.length})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
