import React from 'react';
import type { ChatMessage, TaskItem } from './ChatStore';

function JsonBlock({ data }: { data: TaskItem[] }) {
  return (
    <pre className="bg-slate-50 border border-[#e6e7ea] rounded-md p-3 text-[12.5px] overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  const isTool = msg.role === 'tool';
  return (
    <div className={`flex ${isUser? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${isUser? 'bg-white' : 'bg-white'} border border-[#e6e7ea]`}>
        <div className="text-sm text-slate-800 whitespace-pre-wrap">{msg.content}</div>
        {msg.json && (
          <div className="mt-2">
            <div className="text-[11px] text-slate-500 mb-1">Parsed JSON</div>
            <JsonBlock data={msg.json} />
            <div className="mt-2 flex gap-2 text-sm">
              <button className="px-3 py-1 rounded bg-teal-500 text-white hover:bg-teal-600">Send to Calendar</button>
              <button className="px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700">Export CSV</button>
              <button className="px-3 py-1 rounded bg-white border border-[#e6e7ea]">Fix Ambiguity</button>
            </div>
          </div>
        )}
        {isTool && (
          <div className="mt-2 text-[11px] text-slate-500">Tool: {msg.tool}</div>
        )}
      </div>
    </div>
  );
}
