import React, { useEffect, useMemo, useState } from 'react';
import { Calendar } from './icons';
import { useAppStore } from './AppStore';

type Event = { id?: string; summary: string; start: string; end: string; timeZone?: string };

export default function ScheduleView() {
  const store = useAppStore();
  const suggested = useMemo(() => store.schedule, [store.schedule]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Event>({ summary: '', start: '', end: '' });

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/proxy?path=/calendar/events');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEvents(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const create = async () => {
    if (!draft.summary || !draft.start || !draft.end) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/proxy?path=/calendar/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDraft({ summary: '', start: '', end: '' });
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="rounded-2xl border border-[#3a3d42] bg-[#2b2d31] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-200 font-semibold mb-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">
          <Calendar className="h-4 w-4" />
        </span>
        <span>Schedule</span>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <input className="bg-[#1e1f22] border border-[#3a3d42] rounded px-2 py-1 text-gray-100" placeholder="Title"
               value={draft.summary} onChange={(e)=>setDraft({...draft, summary: e.target.value})} />
        <input className="bg-[#1e1f22] border border-[#3a3d42] rounded px-2 py-1 text-gray-100" placeholder="Start (ISO)" 
               value={draft.start} onChange={(e)=>setDraft({...draft, start: e.target.value})} />
        <input className="bg-[#1e1f22] border border-[#3a3d42] rounded px-2 py-1 text-gray-100" placeholder="End (ISO)" 
               value={draft.end} onChange={(e)=>setDraft({...draft, end: e.target.value})} />
      </div>
      <div className="mt-2">
        <button onClick={create} disabled={loading || !draft.summary || !draft.start || !draft.end}
                className="px-3 py-1.5 rounded bg-teal-600 text-white disabled:opacity-50">Add Event</button>
        {error && <span className="ml-3 text-sm text-red-400">{error}</span>}
      </div>

      <div className="mt-5">
        <div className="text-sm text-gray-300 mb-2">Upcoming</div>
        <ul className="space-y-2">
          {events.map(e => (
            <li key={e.id || e.summary+e.start} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200">
              <div className="font-medium">{e.summary}</div>
              <div className="text-xs text-gray-400">{e.start} → {e.end}</div>
            </li>
          ))}
          {(!loading && events.length===0) && <li className="text-sm text-gray-400">No events</li>}
        </ul>
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-300 mb-2">Suggested from Task Parser</div>
        <ul className="space-y-2">
          {suggested.map((t,i) => (
            <li key={i} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-200">
              <div className="font-medium">{t.task}</div>
              <div className="text-xs text-gray-400">{t.time || t.deadline}</div>
            </li>
          ))}
          {suggested.length===0 && <li className="text-sm text-gray-400">No suggestions yet</li>}
        </ul>
      </div>
    </section>
  );
}
