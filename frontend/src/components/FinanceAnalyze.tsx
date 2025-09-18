import React, { useMemo, useState } from 'react';
import { Lightning } from './icons';
import { useAppStore } from './AppStore';

type Summary = { total: number; byCategory: Record<string, number>; transactions: number };

export default function FinanceAnalyze() {
  const store = useAppStore();
  const suggested = useMemo(() => store.finance, [store.finance]);
  const [csvText, setCsvText] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true); setError(null); setSummary(null);
    try {
      const res = await fetch('/api/proxy?path=/finance/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ csvText })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSummary(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="rounded-2xl border border-[#3a3d42] bg-[#2b2d31] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
          <Lightning className="h-4 w-4" />
        </span>
        <span>Finance Analyze</span>
      </div>

      <textarea
        className="w-full h-32 bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-100 placeholder-gray-500"
        placeholder="Paste CSV with headers like date,description,amount"
        value={csvText}
        onChange={(e)=>setCsvText(e.target.value)}
      />
      <div className="mt-2">
        <button onClick={analyze} disabled={loading || !csvText.trim()} className="px-3 py-1.5 rounded bg-amber-600 text-white disabled:opacity-50">Analyze</button>
        {error && <span className="ml-3 text-sm text-red-400">{error}</span>}
      </div>

      {summary && (
        <div className="mt-4">
          <div className="text-gray-200 font-medium">Total: {summary.total.toFixed(2)}</div>
          <div className="text-sm text-gray-300">Transactions: {summary.transactions}</div>
          <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(summary.byCategory).map(([k, v]) => (
              <div key={k} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200 flex justify-between">
                <span>{k}</span>
                <span>{v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm text-gray-300 mb-2">Suggested from Task Parser</div>
        <ul className="space-y-2">
          {suggested.map((t,i) => (
            <li key={i} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200">
              <div className="font-medium">{t.task}</div>
            </li>
          ))}
          {suggested.length===0 && <li className="text-sm text-gray-400">No suggestions yet</li>}
        </ul>
      </div>
    </section>
  );
}
