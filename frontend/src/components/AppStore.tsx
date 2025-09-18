import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TaskItem = { task: string; time?: string; category?: string; deadline?: string };

type CategorizedData = {
  schedule: TaskItem[];
  finance: TaskItem[];
  documents: TaskItem[];
  email: TaskItem[];
}

type StoreState = CategorizedData & {
  addFromParsed: (items: TaskItem[]) => void;
  clearAll: () => void;
  classify: (items: TaskItem[]) => { schedule: number; finance: number; documents: number; email: number };
};

const Ctx = createContext<StoreState | null>(null);

const STORAGE_KEY = 'taskflow.categorized';

function load(): CategorizedData {
  if (typeof window === 'undefined') return { schedule: [], finance: [], documents: [], email: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        schedule: parsed.schedule || [],
        finance: parsed.finance || [],
        documents: parsed.documents || [],
        email: parsed.email || [],
      };
    }
  } catch {}
  return { schedule: [], finance: [], documents: [], email: [] };
}

function save(data: CategorizedData) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function isFinance(t: TaskItem): boolean {
  const s = `${t.task} ${t.category || ''}`.toLowerCase();
  return /\b(invoice|bill|pay|plătește|factur|payment|amount|spent|spend|dollar|dollars)\b|\$|\b(lei|ron|eur|usd)\b/.test(s);
}

function isSchedule(t: TaskItem): boolean { return !!(t.time || t.deadline); }

function isDocument(t: TaskItem): boolean {
  const s = `${t.task}`.toLowerCase();
  return /\b(document|contract|pdf|scan|act|formular)\b/.test(s);
}

function isEmail(t: TaskItem): boolean {
  const s = `${t.task}`.toLowerCase();
  return /\b(email|mail|reply|send|inbox)\b/.test(s);
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize empty on SSR and first client render to keep markup consistent
  const [data, setData] = useState<CategorizedData>({ schedule: [], finance: [], documents: [], email: [] });
  const [bootstrapped, setBootstrapped] = useState(false);

  // Load persisted data after mount only (client-side)
  useEffect(() => {
    const persisted = load();
    setData(persisted);
    setBootstrapped(true);
  }, []);

  // Persist only after we've loaded initial state to avoid clobbering storage with empty values
  useEffect(() => { if (bootstrapped) save(data); }, [data, bootstrapped]);

  const addFromParsed = (items: TaskItem[]) => {
    if (!items?.length) return;
    setData(prev => {
      const next = { ...prev };
      for (const it of items) {
        if (isSchedule(it)) next.schedule = dedup([...next.schedule, it]);
        if (isFinance(it)) next.finance = dedup([...next.finance, it]);
        if (isDocument(it)) next.documents = dedup([...next.documents, it]);
        if (isEmail(it)) next.email = dedup([...next.email, it]);
      }
      return next;
    });
  };

  const clearAll = () => setData({ schedule: [], finance: [], documents: [], email: [] });

  const classify = (items: TaskItem[]) => {
    let s=0,f=0,d=0,e=0;
    for (const it of items) {
      if (isSchedule(it)) s++;
      if (isFinance(it)) f++;
      if (isDocument(it)) d++;
      if (isEmail(it)) e++;
    }
    return { schedule: s, finance: f, documents: d, email: e };
  };

  const value = useMemo<StoreState>(() => ({ ...data, addFromParsed, clearAll, classify }), [data]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}

function dedup(items: TaskItem[]): TaskItem[] {
  const seen = new Set<string>();
  const out: TaskItem[] = [];
  for (const it of items) {
    const key = `${it.task}|${it.time || ''}|${it.deadline || ''}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}
