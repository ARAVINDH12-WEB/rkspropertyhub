import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, ImageIcon } from "lucide-react";
import type { Path } from "../content/ContentContext";
import { cn } from "../utils/cn";

/* eslint-disable @typescript-eslint/no-explicit-any */

type OnChange = (path: Path, value: any) => void;

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20";

export function humanize(key: string | number): string {
  if (typeof key === "number") return `Item ${key + 1}`;
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

const isImageKey = (k: string) => /(img|image|photo|logo)/i.test(k);
const isLongKey = (k: string) => /(desc|description|quote|about|answer|text|note$|^a$)/i.test(k);
const isTitleKey = (k: string) => /title/i.test(k);

function Label({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{text}</span>
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
    </div>
  );
}

function StringField({ k, value, path, onChange }: { k: string; value: string; path: Path; onChange: OnChange }) {
  const label = humanize(k);
  if (isImageKey(k)) {
    return (
      <div>
        <Label text={label} hint="Paste any image URL" />
        <div className="flex gap-3">
          <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-ink-800">
            {value ? (
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-600" />
            )}
          </div>
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className={cn(inputCls, "resize-none font-mono text-xs")}
          />
        </div>
      </div>
    );
  }
  if (isLongKey(k) || value.length > 90) {
    return (
      <div>
        <Label text={label} />
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
          className={cn(inputCls, "resize-y")}
        />
      </div>
    );
  }
  return (
    <div>
      <Label text={label} hint={isTitleKey(k) ? "Wrap words in *asterisks* for gold highlight" : undefined} />
      <input value={value} onChange={(e) => onChange(path, e.target.value)} className={inputCls} />
    </div>
  );
}

function StringListField({
  k,
  value,
  path,
  onChange,
}: {
  k: string;
  value: string[];
  path: Path;
  onChange: OnChange;
}) {
  return (
    <div>
      <Label text={humanize(k)} />
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => onChange([...path, i], e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => onChange(path, value.filter((_, j) => j !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-rose-400/50 hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange(path, [...value, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-gold-400/50 hover:text-gold-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
    </div>
  );
}

function itemTitle(item: any, index: number): string {
  if (item && typeof item === "object") {
    for (const key of ["name", "title", "label", "q", "type"]) {
      if (typeof item[key] === "string" && item[key]) return item[key];
    }
  }
  return `Item ${index + 1}`;
}

function ObjectListField({
  k,
  value,
  path,
  onChange,
}: {
  k: string;
  value: any[];
  path: Path;
  onChange: OnChange;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(path, next);
    setOpen(null);
  };

  return (
    <div>
      <Label text={humanize(k)} hint={`${value.length} items`} />
      <div className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-1 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-white"
                >
                  <ChevronDown
                    className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "rotate-180")}
                  />
                  <span className="truncate">{itemTitle(item, i)}</span>
                </button>
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Duplicate"
                  onClick={() => onChange(path, [...value.slice(0, i + 1), JSON.parse(JSON.stringify(item)), ...value.slice(i + 1)])}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-gold-300">
                  <Copy className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Delete"
                  onClick={() => { onChange(path, value.filter((_, j) => j !== i)); setOpen(null); }}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {isOpen && (
                <div className="space-y-4 border-t border-white/10 p-4">
                  <ObjectFields value={item} path={[...path, i]} onChange={onChange} />
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const template = value.length
              ? JSON.parse(JSON.stringify(value[value.length - 1]))
              : {};
            onChange(path, [...value, template]);
            setOpen(value.length);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-gold-400/50 hover:text-gold-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add {humanize(k).replace(/s$/, "").toLowerCase()}
        </button>
      </div>
    </div>
  );
}

export function Field({ k, value, path, onChange }: { k: string; value: any; path: Path; onChange: OnChange }) {
  if (typeof value === "string") return <StringField k={k} value={value} path={path} onChange={onChange} />;
  if (typeof value === "number")
    return (
      <div>
        <Label text={humanize(k)} />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value) || 0)}
          className={inputCls}
        />
      </div>
    );
  if (typeof value === "boolean")
    return (
      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <span className="text-sm font-medium text-slate-200">{humanize(k)}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(path, !value)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            value ? "bg-gold-400" : "bg-white/15"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
              value ? "left-[22px]" : "left-0.5"
            )}
          />
        </button>
      </label>
    );
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string"))
      return <StringListField k={k} value={value} path={path} onChange={onChange} />;
    return <ObjectListField k={k} value={value} path={path} onChange={onChange} />;
  }
  if (value && typeof value === "object")
    return (
      <fieldset className="rounded-xl border border-white/10 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {humanize(k)}
        </legend>
        <div className="space-y-4">
          <ObjectFields value={value} path={path} onChange={onChange} />
        </div>
      </fieldset>
    );
  return null;
}

export function ObjectFields({ value, path, onChange }: { value: any; path: Path; onChange: OnChange }) {
  return (
    <>
      {Object.entries(value).map(([k, v]) => (
        <Field key={k} k={k} value={v} path={[...path, k]} onChange={onChange} />
      ))}
    </>
  );
}
