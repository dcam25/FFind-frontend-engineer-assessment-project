import type { ChatSession } from '~/types/chat';

export const useChatStorage = () => {
  const STORAGE_KEY = 'nexus_chat_sessions_nuxt';

  const loadSessions = (): ChatSession[] => {
    if (process.server) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveSessions = (sessions: ChatSession[]) => {
    if (process.server) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {}
  };

  const clearAllSessions = () => {
    if (process.server) return;
    localStorage.removeItem(STORAGE_KEY);
  };

  return { loadSessions, saveSessions, clearAllSessions };
};
