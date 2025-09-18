import React, { useMemo, useState } from 'react';
import { Search, Clock, Calendar as CalIcon, Tag } from './icons';
import { useAppStore } from './AppStore';

type Entity = { type: string; value: string };
type Task = { task: string; time?: string; category?: string; deadline?: string };

export default function DocumentScanner() {
  const store = useAppStore();
  const suggested = useMemo(() => store.documents, [store.documents]);
  const [text, setText] = useState('');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/proxy?path=/documents/extract', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEntities(data.entities || []);
      setTasks(data.tasks || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="rounded-2xl border border-[#3a3d42] bg-[#2b2d31] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
          <Search className="h-4 w-4" />
        </span>
        <span>Scan Documents</span>
      </div>

      <textarea className="w-full h-28 bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-100 placeholder-gray-500"
                value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste text extracted from a document..." />
      <div className="mt-2">
        <button onClick={extract} disabled={loading || !text.trim()} className="px-3 py-1.5 rounded bg-blue-600 text-white disabled:opacity-50">Extract</button>
        {error && <span className="ml-3 text-sm text-red-400">{error}</span>}
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-300 mb-2">Entities</div>
          <ul className="space-y-2">
            {entities.map((e, i) => (
              <li key={i} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200 flex justify-between">
                <span className="text-gray-400 text-xs uppercase">{e.type}</span>
                <span>{e.value}</span>
              </li>
            ))}
            {entities.length === 0 && <li className="text-sm text-gray-400">No entities</li>}
          </ul>
        </div>
        <div>
          <div className="text-sm text-gray-300 mb-2">Tasks</div>
          <ul className="space-y-2">
            {tasks.map((t, i) => (
              <li key={i} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200">
                <div className="font-medium">{t.task}</div>
                <div className="text-xs text-gray-400 flex gap-2 items-center">
                  {t.time && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.time}</span>}
                  {t.deadline && <span className="inline-flex items-center gap-1"><CalIcon className="h-3 w-3" /> {t.deadline}</span>}
                  {t.category && <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {t.category}</span>}
                </div>
              </li>
            ))}
            {tasks.length === 0 && <li className="text-sm text-gray-400">No tasks</li>}
          </ul>
        </div>
      </div>

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
