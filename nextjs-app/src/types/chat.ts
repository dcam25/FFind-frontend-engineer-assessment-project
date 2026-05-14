export type Role = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}
