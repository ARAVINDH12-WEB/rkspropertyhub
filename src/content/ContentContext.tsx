import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "./defaultContent";

const STORAGE_KEY = "rks-site-content-v1";

export type Path = (string | number)[];

/* eslint-disable @typescript-eslint/no-explicit-any */
function deepMerge(base: any, override: any): any {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (base && typeof base === "object") {
    const out: any = { ...base };
    if (override && typeof override === "object" && !Array.isArray(override)) {
      for (const k of Object.keys(override)) {
        out[k] = k in base ? deepMerge(base[k], override[k]) : override[k];
      }
    }
    return out;
  }
  return override === undefined ? base : override;
}

export function setIn(obj: any, path: Path, value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
  clone[head as any] = setIn(obj?.[head as any], rest, value);
  return clone;
}

function loadLocal(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return deepMerge(defaultContent, JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return defaultContent;
}

interface Ctx {
  content: SiteContent;
  updateAt: (path: Path, value: any) => void;
  replace: (next: SiteContent) => void;
  importJson: (json: string) => boolean;
  reset: () => void;
  savedAt: number;
  saveToBackend: () => Promise<boolean>;
  syncing: boolean;
}

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadLocal);
  const [savedAt, setSavedAt] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // 1. Initial fetch from Backend Database if available
  useEffect(() => {
    fetch("/api/v1/site-content")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const merged = deepMerge(defaultContent, res.data);
          setContent(merged);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            /* ignore */
          }
          if (res.updatedAt) setSavedAt(new Date(res.updatedAt).getTime());
        }
      })
      .catch(() => {
        // Fallback to local storage
      });
  }, []);

  const persist = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      setSavedAt(Date.now());

      // Auto-sync to backend if admin token is present
      const token = localStorage.getItem("rks_admin_token");
      if (token) {
        fetch("/api/v1/admin/site-content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(next),
        }).catch(() => {
          /* ignore */
        });
      }

      return next;
    });
  }, []);

  const updateAt = useCallback((path: Path, value: any) => persist((prev) => setIn(prev, path, value)), [persist]);
  const replace = useCallback((next: SiteContent) => persist(() => deepMerge(defaultContent, next)), [persist]);
  const importJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        persist(() => deepMerge(defaultContent, parsed));
        return true;
      } catch {
        return false;
      }
    },
    [persist]
  );

  const reset = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContent(defaultContent);
    setSavedAt(Date.now());

    const token = localStorage.getItem("rks_admin_token");
    if (token) {
      await fetch("/api/v1/admin/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(defaultContent),
      }).catch(() => {});
    }
  }, []);

  const saveToBackend = useCallback(async (): Promise<boolean> => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("rks_admin_token");
      const res = await fetch("/api/v1/admin/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      setSavedAt(Date.now());
      return data.success;
    } catch {
      return false;
    } finally {
      setSyncing(false);
    }
  }, [content]);

  // Sync edits across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setContent(loadLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateAt, replace, importJson, reset, savedAt, saveToBackend, syncing }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
