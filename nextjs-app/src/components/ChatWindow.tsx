'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from 'lucide-react';
import type { ChatMessage, ChatSession } from '@/types/chat';
import { loadSessions, saveSessions } from '@/lib/storage';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load
  useEffect(() => {
    const saved = loadSessions();
    if (saved.length) {
      setSessions(saved);
      setActiveSessionId(saved[0].id);
    } else {
      const initialSession: ChatSession = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now()
      };
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
    }

    // Keyboard Shortcut CMD/CTRL + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('textarea') || document.querySelector('input');
        input?.focus();
        toast.info('Input focused' , { duration: 1000 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.remove('keydown', handleKeyDown);
  }, []);

  // 2. Persist Sessions
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  // 3. Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSessionId, loading]);

  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const updateActiveSession = (newMessages: ChatMessage[]) => {
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { 
            ...session, 
            messages: newMessages, 
            updatedAt: Date.now(),
            title: session.title === 'New Chat' && newMessages.length > 0 
              ? newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : '')
              : session.title
          } 
        : session
    ));
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    toast.success('Session renamed');
  };

  const handleSend = useCallback(async (input: string) => {
    if (!input.trim() || !activeSessionId) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    updateActiveSession(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
          history: messages.slice(-10),
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong.');
      }

      if (!res.body) throw new Error('No readable stream available.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      const aiMsgId = crypto.randomUUID();
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        
        let displayText = accumulated;
        try {
          const parsed = JSON.parse(accumulated);
          if (parsed.response) displayText = parsed.response;
        } catch {
          if (accumulated.startsWith('{"response":"')) {
            let stripped = accumulated.substring(13);
            if (stripped.endsWith('"}')) stripped = stripped.slice(0, -2);
            else if (stripped.endsWith('"')) stripped = stripped.slice(0, -1);
            stripped = stripped.replace(/\\n/g, '\n').replace(/\\"/g, '"');
            displayText = stripped;
          }
        }

        if (isFirstChunk) {
          setLoading(false);
          isFirstChunk = false;
        }

        const scrollEl = document.querySelector(`.${styles.messages}`);
        const wasAtBottom = scrollEl ? (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 50) : true;
        const currentScrollTop = scrollEl ? scrollEl.scrollTop : 0;

        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;
          const exists = s.messages.some(m => m.id === aiMsgId);
          if (!exists) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, { id: aiMsgId, role: 'ai', content: displayText, timestamp: Date.now() }]
            };
          }
          return {
            ...s,
            updatedAt: Date.now(),
            messages: s.messages.map(m => m.id === aiMsgId ? { ...m, content: displayText } : m)
          };
        }));

        // Use flushSync or simply synchronous DOM update since setSessions is batched
        // Actually, we can just set it immediately or use setTimeout with 0
        setTimeout(() => {
          if (scrollEl) {
            if (!wasAtBottom) {
              scrollEl.scrollTop = currentScrollTop;
            } else {
              scrollEl.scrollTop = scrollEl.scrollHeight;
            }
          }
        }, 0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed.';
      toast.error(msg);
      setError(msg);
      setLoading(false);
    }

  }, [activeSessionId, messages]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    toast.success('New chat started');
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0]?.id || null);
      if (remaining.length === 0) {
        handleNewChat();
      }
    }
    toast.info('Chat session deleted');
  };

  const handleClearChat = useCallback(() => {
    updateActiveSession([]);
    setError(null);
    toast.info('Chat history cleared');
  }, [activeSessionId]);

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar 
        sessions={sessions}
        activeId={activeSessionId || ''}
        onSelect={setActiveSessionId}
        onNew={handleNewChat}
        onDelete={handleDeleteSession}
        onRename={handleRenameSession}
        onJump={handleJump}
      />
      
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="url(#g1)"/>
                <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c6af7"/>
                    <stop offset="1" stopColor="#a78bfa"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>Nexus AI</h1>
              <p className={styles.subtitle}>{activeSession?.title || 'New Chat'} &bull; GPT-4o mini</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.badge}>
              <span className={styles.dot} />
              {loading ? 'Thinking...' : 'Online'}
            </span>
            {messages.length > 0 && (
              <button className={styles.clearBtn} onClick={handleClearChat} title="Clear Chat">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </header>

        <main className={styles.messages} role="log">
          {messages.length === 0 && !loading && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>✦</div>
              <h2 className={styles.emptyTitle}>How can I help you today?</h2>
              <p className={styles.emptyText}>Ask me anything — code, ideas, analysis, or just a chat. Press <kbd className={styles.kbd}>⌘ K</kbd> to focus.</p>
              <div className={styles.suggestGrid}>
                {['Explain async/await', 'Utility type in TS', 'SSR vs CSR', 'Debug React component'].map(s => (
                  <button key={s} className={styles.suggest} onClick={() => handleSend(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </main>

        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
