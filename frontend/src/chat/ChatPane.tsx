import React, { useEffect } from 'react';
import { useChatStore, type ChatMessage } from './ChatStore';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';

export default function ChatPane() {
  const { threads, currentId, addThread, addMessage } = useChatStore();

  const current = threads.find(t => t.id === currentId) || threads[0];

  useEffect(() => {
    if (!current) {
      const id = addThread('New Parse');
      // optional: seed system message
      addMessage(id, { id: `${Date.now()}-sys`, role: 'system', content: 'Transform messy thoughts into structured tasks.', ts: Date.now() });
    }
  }, [current, addThread, addMessage]);

  const onSend = async (text: string) => {
    const tid = current?.id || threads[0]?.id;
    if (!tid) return;
    const now = Date.now();
    const userMsg: ChatMessage = { id: `${now}-u`, role: 'user', content: text, ts: now };
    addMessage(tid, userMsg);

    try {
      const resp = await fetch('/api/proxy?path=/parse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const data = await resp.json();
      const toolMsg: ChatMessage = { id: `${now}-tool`, role: 'tool', tool: 'parser', content: 'Parsed tasks', json: data, ts: Date.now() };
      addMessage(tid, toolMsg);
    } catch (e: any) {
      const errMsg: ChatMessage = { id: `${now}-err`, role: 'assistant', content: `Error: ${e.message || e}`, ts: Date.now() };
      addMessage(tid, errMsg);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-4 pt-3">
        <div className="inline-flex items-center gap-2 text-xs text-slate-600 border border-[#e6e7ea] bg-white rounded-full px-2.5 py-0.5">AI‑Powered Task Management</div>
        <h1 className="mt-2 text-2xl font-semibold text-slate-800">Transform messy thoughts into structured tasks</h1>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {current?.messages.map(m => <MessageBubble key={m.id} msg={m} />)}
      </div>
      <MessageComposer onSend={onSend} />
    </main>
  );
}
