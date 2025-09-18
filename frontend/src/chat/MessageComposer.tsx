import React, { useState } from 'react';
import { useChatStore } from './ChatStore';

export default function MessageComposer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const [forceJson, setForceJson] = useState(true);
  const [lang, setLang] = useState<'ro' | 'en'>('ro');

  return (
    <div className="border-t border-[#e6e7ea] p-3">
      <div className="flex items-center gap-2 mb-2 text-[12px] text-slate-600">
        <select value={lang} onChange={e=>setLang(e.target.value as any)} className="border border-[#e6e7ea] rounded px-2 py-1 bg-white">
          <option value="ro">RO</option>
          <option value="en">EN</option>
        </select>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={forceJson} onChange={e=>setForceJson(e.target.checked)} />
          Force JSON
        </label>
        <select className="ml-auto border border-[#e6e7ea] rounded px-2 py-1 bg-white">
          <option>Examples (RO)</option>
          <option>Examples (EN)</option>
        </select>
      </div>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          rows={3}
          placeholder="Describe tasks… (supports RO/EN)"
          className="flex-1 border border-[#e6e7ea] rounded-md p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        <div className="flex flex-col gap-2">
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-teal-500 to-green-400 text-white shadow-sm hover:shadow"
            onClick={() => { if (text.trim()) { onSend(text); setText(''); } }}
          >Send</button>
          <button className="px-4 py-2 rounded border border-[#e6e7ea] bg-white">🎤</button>
          <button className="px-4 py-2 rounded border border-[#e6e7ea] bg-white">📎</button>
        </div>
      </div>
    </div>
  );
}
