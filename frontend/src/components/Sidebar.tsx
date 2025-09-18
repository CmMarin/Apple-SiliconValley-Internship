import React, { useEffect, useState } from 'react';

type TabKey = 'schedule' | 'finance' | 'documents' | 'email';

export interface SidebarState {
  active: TabKey;
  tabs: Array<{ key: TabKey; label: string }>
}

const DEFAULT_TABS: SidebarState['tabs'] = [
  { key: 'schedule', label: 'Schedule' },
  { key: 'finance', label: 'Finance Analyze' },
  { key: 'documents', label: 'Scan Documents' },
  { key: 'email', label: 'Email Organizer' },
];

const EXTRA_TABS: SidebarState['tabs'] = [];

interface Props {
  value?: SidebarState;
  onChange?: (state: SidebarState) => void;
}

export default function Sidebar({ value, onChange }: Props) {
  const [state, setState] = useState<SidebarState>(value ?? { active: 'schedule', tabs: DEFAULT_TABS });

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('taskflow.sidebar');
      if (raw) {
        const parsed = JSON.parse(raw) as SidebarState;
        setState(parsed);
        onChange?.(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('taskflow.sidebar', JSON.stringify(state));
    } catch {}
  }, [state]);

  const setActive = (key: TabKey) => {
    const next = { ...state, active: key };
    setState(next);
    onChange?.(next);
  };

  const addTab = (key: TabKey) => {
    if (state.tabs.find(t => t.key === key)) return;
    const toAdd = DEFAULT_TABS.find(t => t.key === key);
    if (!toAdd) return;
    const next = { ...state, tabs: [...state.tabs, toAdd] };
    setState(next);
    onChange?.(next);
  };

  const removeTab = (key: TabKey) => {
    const isDefault = DEFAULT_TABS.some(t => t.key === key);
    if (isDefault) {
      if (!confirm('Remove default tab? You can add it back later.')) return;
    }
  const nextTabs = state.tabs.filter(t => t.key !== key);
  const nextActive = state.active === key ? (nextTabs[0]?.key ?? 'schedule') : state.active;
    const next = { active: nextActive as TabKey, tabs: nextTabs };
    setState(next);
    onChange?.(next);
  };

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-[#2b2d31] bg-[#2b2d31] text-gray-200">
      <div className="p-4 border-b border-[#1e1f22]">
        <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Tabs</div>
        <nav className="space-y-1">
          {state.tabs.map((t) => (
            <div key={t.key} className="group flex items-center gap-2">
              <button
                onClick={() => setActive(t.key)}
                className={`flex-1 text-left px-3 py-2 rounded-md transition-colors ${
                  state.active === t.key
                    ? 'bg-[#3f4248] text-white'
                    : 'hover:bg-[#3a3d42] text-gray-200'
                }`}
              >
                {t.label}
              </button>
              <button
                onClick={() => removeTab(t.key)}
                title="Remove tab"
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-300 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-400 mb-2">Add tab</div>
        <div className="grid grid-cols-1 gap-2">
          {EXTRA_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => addTab(t.key)}
              className="text-left px-3 py-2 rounded-md border border-[#3a3d42] hover:bg-[#3a3d42] text-gray-200"
            >
              + {t.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
