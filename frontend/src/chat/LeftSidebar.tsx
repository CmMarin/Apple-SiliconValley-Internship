import React from 'react';
import { useChatStore } from './ChatStore';

export default function LeftSidebar() {
  const { threads, currentId, setCurrent, addThread } = useChatStore();
  return (
    <aside className="h-full w-[260px] border-r border-[#e6e7ea] bg-[#fafbfc] text-slate-800 p-3">
      <button
        className="w-full mb-3 rounded-lg bg-gradient-to-r from-teal-500 to-green-400 text-white py-2 shadow-sm hover:shadow transition"
        onClick={() => addThread('New Parse')}
      >
        New Parse
      </button>

      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Recent</div>
      <div className="space-y-1">
        {threads.map(t => (
          <button
            key={t.id}
            onClick={() => setCurrent(t.id)}
            className={`w-full text-left px-3 py-2 rounded-md ${currentId===t.id? 'bg-white shadow-sm border border-[#e6e7ea]' : 'hover:bg-white/70'}`}
          >
            <div className="truncate text-sm">{t.title}</div>
            <div className="text-[11px] text-slate-500">{t.messages.length} messages</div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs uppercase tracking-wide text-slate-500 mb-2">Pinned prompts</div>
      <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
        <li>Extrage sarcini și termene (RO)</li>
        <li>Extract tasks and deadlines (EN)</li>
      </ul>
    </aside>
  );
}
