import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Toast = { id: string; title: string; description?: string };

type Ctx = { addToast: (title: string, description?: string) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function useToaster() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToaster must be used within ToasterProvider');
  return ctx;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback((title: string, description?: string) => {
    const id = `${Date.now()}-${idRef.current++}`;
    setToasts((t) => [...t, { id, title, description }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const ctx = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="fixed top-3 right-3 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="min-w-[220px] max-w-sm bg-[#2b2d31] border border-[#3a3d42] text-gray-100 rounded-md shadow p-3">
            <div className="font-medium">{t.title}</div>
            {t.description && <div className="text-xs text-gray-400 mt-0.5">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
