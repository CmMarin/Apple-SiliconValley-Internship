import React, { useMemo, useState } from 'react';
import { Brain } from './icons';
import { useAppStore } from './AppStore';
import { useToaster } from './Toaster';

type TaskItem = { task: string; time?: string; category?: string; deadline?: string };
interface Props { onParsed?: (items: TaskItem[]) => void }

export default function TaskParser({ onParsed }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ task: string; time?: string; category?: string; deadline?: string }>>([]);
  const hasResults = useMemo(() => results.length > 0, [results]);
  const store = useAppStore();
  const { addToast } = useToaster();

  const updateTask = (idx: number, patch: Partial<{ task: string; time?: string; category?: string; deadline?: string }>) => {
    setResults(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const deleteTask = (idx: number) => {
    setResults(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <section className="mt-8 rounded-2xl border border-[#3a3d42] bg-[#2b2d31] p-6 md:p-7 shadow-sm">
      <div className="flex items-center gap-2 text-gray-200 font-semibold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
          <Brain className="h-4 w-4" />
        </span>
        <span>Task Parser</span>
        <span className="ml-auto text-xs text-gray-300 bg-[#1e1f22] border border-[#3a3d42] rounded-full px-2.5 py-0.5">AI Powered</span>
      </div>

      <p className="text-gray-400 text-sm mt-3">Process natural language into structured tasks</p>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Describe your tasks naturally in Romanian or English..."
          className="w-full rounded-xl border border-[#3a3d42] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/20 p-4 outline-none bg-[#1e1f22] text-gray-100 placeholder-gray-500"
        />
        <div className="text-xs text-gray-400 mt-3 space-y-1">
          <div className="font-medium">Examples:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Trebuie să duc copiii la școală la 8 dimineața și să cumpăr fructe</li>
            <li>I have a meeting with Ana tomorrow at 3 PM</li>
            <li>Plătește factura la lumină până pe 15 și rezervă masa</li>
          </ul>
        </div>
      </div>

      <button
        onClick={async () => {
          setError(null);
          setResults([]);
          if (!text.trim()) return;
          setLoading(true);
          try {
            const res = await fetch('/api/proxy?path=/parse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            if (!res.ok) throw new Error(`Parse failed: ${res.status}`);
            const data = await res.json();
            setResults(data);
            try { onParsed?.(data); } catch {}
          } catch (e: any) {
            setError(e.message ?? 'Failed to parse');
          } finally {
            setLoading(false);
          }
        }}
        className={`mt-5 w-full md:w-auto rounded-xl px-6 py-3 font-semibold ${
          text.trim() && !loading
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-[#3a3d42] text-gray-400 cursor-not-allowed'
        }`}
        disabled={!text.trim() || loading}
      >
        {loading ? 'Parsing…' : 'Parse Tasks'}
      </button>

      {error && (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      )}

      {hasResults && (
        <div className="mt-6">
          <div className="text-sm text-gray-300 mb-2">Parsed tasks</div>
          <ul className="space-y-2">
            {results.map((t, i) => (
              <li key={i} className="rounded-lg border border-[#3a3d42] bg-[#1e1f22] p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <label className="text-gray-300">
                    <span className="block text-xs uppercase tracking-wide text-gray-400">Task</span>
                    <input
                      className="mt-1 w-full bg-[#2b2d31] text-gray-100 border border-[#3a3d42] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      value={t.task}
                      onChange={(e) => updateTask(i, { task: e.target.value })}
                    />
                  </label>
                  <label className="text-gray-300">
                    <span className="block text-xs uppercase tracking-wide text-gray-400">Time</span>
                    <input
                      className="mt-1 w-full bg-[#2b2d31] text-gray-100 border border-[#3a3d42] rounded px-2 py-1"
                      value={t.time ?? ''}
                      onChange={(e) => updateTask(i, { time: e.target.value || undefined })}
                    />
                  </label>
                  <label className="text-gray-300">
                    <span className="block text-xs uppercase tracking-wide text-gray-400">Deadline</span>
                    <input
                      className="mt-1 w-full bg-[#2b2d31] text-gray-100 border border-[#3a3d42] rounded px-2 py-1"
                      value={t.deadline ?? ''}
                      onChange={(e) => updateTask(i, { deadline: e.target.value || undefined })}
                    />
                  </label>
                  <label className="text-gray-300">
                    <span className="block text-xs uppercase tracking-wide text-gray-400">Category</span>
                    <input
                      className="mt-1 w-full bg-[#2b2d31] text-gray-100 border border-[#3a3d42] rounded px-2 py-1"
                      value={t.category ?? ''}
                      onChange={(e) => updateTask(i, { category: e.target.value || undefined })}
                    />
                  </label>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    className="text-red-300 hover:text-red-200 text-sm"
                    onClick={() => deleteTask(i)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <button
              className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-500 text-white"
              onClick={() => {
                if (results.length === 0) return;
                store.addFromParsed(results);
                const counts = store.classify(results);
                const parts = [
                  counts.schedule ? `${counts.schedule} to Schedule` : '',
                  counts.finance ? `${counts.finance} to Finance` : '',
                  counts.documents ? `${counts.documents} to Documents` : '',
                  counts.email ? `${counts.email} to Email` : '',
                ].filter(Boolean).join(', ');
                addToast('Added tasks', parts || 'Categorized');
                setResults([]);
              }}
            >
              Confirm All
            </button>
            <button
              className="px-4 py-2 rounded bg-[#3a3d42] text-gray-200 hover:bg-[#44474e]"
              onClick={() => setResults([])}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
 
