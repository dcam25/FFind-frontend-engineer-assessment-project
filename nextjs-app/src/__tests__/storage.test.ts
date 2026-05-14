import { loadHistory, saveHistory, clearHistory } from '@/lib/storage';
import type { ChatMessage } from '@/types/chat';

const STORAGE_KEY = 'ffind_chat_history';

const mockMessage: ChatMessage = {
  id: '1',
  role: 'user',
  content: 'Hello',
  timestamp: 1234567890,
};

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadHistory returns [] when nothing is stored', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('saveHistory persists messages to localStorage', () => {
    saveHistory([mockMessage]);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual([mockMessage]);
  });

  it('loadHistory retrieves saved messages', () => {
    saveHistory([mockMessage]);
    expect(loadHistory()).toEqual([mockMessage]);
  });

  it('clearHistory removes messages from localStorage', () => {
    saveHistory([mockMessage]);
    clearHistory();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadHistory()).toEqual([]);
  });

  it('loadHistory returns [] when stored value is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    expect(loadHistory()).toEqual([]);
  });

  it('saveHistory stores multiple messages in order', () => {
    const msgs: ChatMessage[] = [
      { id: '1', role: 'user', content: 'Hi', timestamp: 1000 },
      { id: '2', role: 'ai',   content: 'Hello!', timestamp: 1001 },
    ];
    saveHistory(msgs);
    expect(loadHistory()).toEqual(msgs);
  });
});
