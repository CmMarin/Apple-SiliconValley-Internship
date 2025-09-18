import React, { useMemo, useState } from 'react';
import { Bell } from './icons';
import { useAppStore } from './AppStore';

type Email = { subject: string; body: string };
type Task = { task: string; time?: string; category?: string; deadline?: string };
type Result = { subject: string; categories: string[]; tasks: Task[] };

export default function EmailOrganizer() {
  const store = useAppStore();
  const suggested = useMemo(() => store.email, [store.email]);
  const [emailsText, setEmailsText] = useState('Subject: Invoice due\nBody: Please pay by 15/10.');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseEmails = (txt: string): Email[] => {
    // Very simple parser: blocks separated by blank lines, with Subject:/Body:
    const blocks = txt.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const out: Email[] = [];
    for (const b of blocks) {
      const sm = b.match(/Subject:\s*(.*)/i);
      const bm = b.match(/Body:\s*([\s\S]*)/i);
      if (sm) {
        out.push({ subject: sm[1].trim(), body: (bm?.[1] || '').trim() });
      }
    }
    return out;
  };

  const organize = async () => {
    setLoading(true); setError(null); setResults([]);
    try {
      const emails = parseEmails(emailsText);
      const res = await fetch('/api/proxy?path=/emails/organize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emails })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResults(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="rounded-2xl border border-[#3a3d42] bg-[#2b2d31] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20 text-pink-300">
          <Bell className="h-4 w-4" />
        </span>
        <span>Email Organizer</span>
      </div>

      <textarea className="w-full h-32 bg-[#1e1f22] border border-[#3a3d42] rounded p-2 text-gray-100"
                value={emailsText} onChange={(e)=>setEmailsText(e.target.value)} />
      <div className="mt-2">
        <button onClick={organize} disabled={loading || !emailsText.trim()} className="px-3 py-1.5 rounded bg-pink-600 text-white disabled:opacity-50">Organize</button>
        {error && <span className="ml-3 text-sm text-red-400">{error}</span>}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-[#1e1f22] border border-[#3a3d42] rounded p-3 text-gray-200">
              <div className="font-medium">{r.subject}</div>
              <div className="text-xs text-gray-400">{r.categories.join(', ')}</div>
              <ul className="mt-2 space-y-1">
                {r.tasks.map((t, j) => (
                  <li key={j} className="text-sm">
                    • {t.task}
                  </li>
                ))}
                {r.tasks.length===0 && <li className="text-xs text-gray-400">No tasks</li>}
              </ul>
            </div>
          ))}
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
