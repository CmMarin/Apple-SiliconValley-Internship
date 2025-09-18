import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';
export type TaskItem = { task: string; time?: string; category?: string; deadline?: string };
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  json?: TaskItem[]; // structured parse output when role === 'assistant' or 'tool'
  tool?: 'parser' | 'temporal' | 'classifier' | 'validator';
  ts: number;
};

export type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  pinned?: boolean;
};

type StoreState = {
  threads: ChatThread[];
  currentId?: string;
  setCurrent: (id: string) => void;
  addThread: (title?: string) => string;
  addMessage: (threadId: string, msg: ChatMessage) => void;
  updateTitle: (threadId: string, title: string) => void;
};

const STORAGE_KEY = 'taskflow.chat';
const Ctx = createContext<StoreState | null>(null);

const emptyState = (): { threads: ChatThread[]; currentId?: string } => ({ threads: [], currentId: undefined });

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(emptyState());
  const [boot, setBoot] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw));
      }
    } catch {}
    setBoot(true);
  }, []);

  useEffect(() => {
    if (!boot) return;
    try { if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state, boot]);

  const setCurrent = (id: string) => setState(s => ({ ...s, currentId: id }));

  const addThread = (title?: string) => {
    const id = `${Date.now()}`;
    const thread: ChatThread = { id, title: title || 'New thread', messages: [] };
    setState(s => ({ threads: [thread, ...s.threads], currentId: id }));
    return id;
  };

  const addMessage = (threadId: string, msg: ChatMessage) => {
    setState(s => ({
      ...s,
      threads: s.threads.map(t => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t))
    }));
  };

  const updateTitle = (threadId: string, title: string) => {
    setState(s => ({
      ...s,
      threads: s.threads.map(t => (t.id === threadId ? { ...t, title } : t))
    }));
  };

  const value = useMemo<StoreState>(() => ({
    threads: state.threads,
    currentId: state.currentId,
    setCurrent,
    addThread,
    addMessage,
    updateTitle,
  }), [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChatStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChatStore must be used within ChatStoreProvider');
  return ctx;
}
