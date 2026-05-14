<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { ChatMessage, ChatSession } from '~/types/chat';

const { loadSessions, saveSessions } = useChatStorage();

const sessions = ref<ChatSession[]>([]);
const activeSessionId = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const bottomRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const saved = loadSessions();
  if (saved.length) {
    sessions.value = saved;
    activeSessionId.value = saved[0].id;
  } else {
    const initialSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    sessions.value = [initialSession];
    activeSessionId.value = initialSession.id;
  }

  // Keyboard Shortcuts
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('textarea')?.focus() || document.querySelector('input')?.focus();
      toast.info('Input focused' , { duration: 1000 });
    }
  };
  window.addEventListener('keydown', onKeyDown);
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
});

watch(sessions, (newSessions) => {
  if (newSessions.length > 0) {
    saveSessions(newSessions);
  }
}, { deep: true });

watch([activeSessionId, loading], () => {
  nextTick(() => {
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
});

const activeSession = computed(() => 
  sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0]
);
const messages = computed(() => activeSession.value?.messages || []);

const updateActiveSession = (newMessages: ChatMessage[]) => {
  sessions.value = sessions.value.map(s => 
    s.id === activeSessionId.value 
      ? { 
          ...s, 
          messages: newMessages, 
          updatedAt: Date.now(),
          title: s.title === 'New Chat' && newMessages.length > 0 
            ? newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : '')
            : s.title
        } 
      : s
  );
};

const handleRenameSession = ({ id, title }: { id: string, title: string }) => {
  sessions.value = sessions.value.map(s => s.id === id ? { ...s, title } : s);
  toast.success('Session renamed');
};

const handleSend = async (content: string) => {
  if (!content.trim() || !activeSessionId.value) return;
  error.value = null;

  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: content.trim(),
    timestamp: Date.now(),
  };

  const updatedMessages = [...messages.value, userMsg];
  updateActiveSession(updatedMessages);
  loading.value = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: content.trim(), history: messages.value.slice(-10) }),
    });

    if (!res.ok) {
      throw new Error('Request failed');
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No stream available');
    
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
        loading.value = false;
        isFirstChunk = false;
      }

      const el = document.querySelector('.messages');
      const wasAtBottom = el ? (el.scrollHeight - el.scrollTop - el.clientHeight < 50) : true;
      const currentScrollTop = el ? el.scrollTop : 0;

      const activeIdx = sessions.value.findIndex(s => s.id === activeSessionId.value);
      if (activeIdx !== -1) {
        const session = sessions.value[activeIdx];
        const msgIdx = session.messages.findIndex(m => m.id === aiMsgId);
        if (msgIdx === -1) {
          session.messages.push({
            id: aiMsgId,
            role: 'ai',
            content: displayText,
            timestamp: Date.now()
          });
        } else {
          session.messages[msgIdx].content = displayText;
        }
        session.updatedAt = Date.now();
      }
      
      nextTick(() => { 
        if (el) {
          if (!wasAtBottom) {
            el.scrollTop = currentScrollTop;
          } else {
            bottomRef.value?.scrollIntoView({ behavior: 'instant' });
          }
        }
      });
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to send message');
    error.value = err.message;
    loading.value = false;
  }
};

const handleNewChat = () => {
  const newSession: ChatSession = {
    id: crypto.randomUUID(),
    title: 'New Chat',
    messages: [],
    updatedAt: Date.now()
  };
  sessions.value.unshift(newSession);
  activeSessionId.value = newSession.id;
  toast.success('New chat started');
};

const handleDeleteSession = (id: string) => {
  const remaining = sessions.value.filter(s => s.id !== id);
  sessions.value = remaining;
  if (activeSessionId.value === id) {
    activeSessionId.value = remaining[0]?.id || null;
    if (remaining.length === 0) {
      handleNewChat();
    }
  }
  toast.info('Chat session deleted');
};

const handleJump = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('highlight-pulse');
    setTimeout(() => el.classList.remove('highlight-pulse'), 2000);
  }
};

const handleClear = () => {
  updateActiveSession([]);
  error.value = null;
  toast.info('Chat history cleared');
};
</script>

<template>
  <div class="container">
    <Sidebar 
      :sessions="sessions" 
      :activeId="activeSessionId" 
      @select="activeSessionId = $event"
      @new="handleNewChat"
      @delete="handleDeleteSession"
      @rename="handleRenameSession"
      @jump="handleJump"
    />

    <div class="wrapper">
      <header class="header">
        <div class="headerLeft">
          <div class="logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="url(#g1)"/>
              <path d="M8 14l4 4 8-8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#7c6af7"/>
                  <stop offset="1" stop-color="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 class="title">Nexus AI</h1>
            <p class="subtitle">{{ activeSession?.title || 'New Chat' }} &bull; GPT-4o mini</p>
          </div>
        </div>
        <div class="headerRight">
          <span class="badge">
            <span class="dot" :style="{ background: loading ? 'var(--warning)' : 'var(--success)' }" />
            {{ loading ? 'Thinking...' : 'Online' }}
          </span>
          <button v-if="messages.length > 0" class="clearBtn" @click="handleClear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14H6L5 6"></path>
              <path d="M10 11v6m4-6v6"></path>
              <path d="M9 6V4h6v2"></path>
            </svg>
            Clear
          </button>
        </div>
      </header>

      <main class="messages">
        <div v-if="messages.length === 0 && !loading" class="empty">
          <div class="emptyIcon">✦</div>
          <h2 class="emptyTitle">How can I help you today?</h2>
          <p class="emptyText">Ask me anything. Press <span class="kbd">⌘ K</span> to focus.</p>
          <div class="suggestGrid">
            <button v-for="s in ['Nuxt 3 vs Next.js', 'Vue 3 Composition API', 'SSR vs CSR']" :key="s" class="suggest" @click="handleSend(s)">
              {{ s }}
            </button>
          </div>
        </div>

        <MessageBubble v-for="msg in messages" :key="msg.id" :message="msg" />
        <TypingIndicator v-if="loading" />
        <div v-if="error" class="errorBanner">⚠️ {{ error }}</div>
        <div ref="bottomRef" />
      </main>

      <ChatInput :disabled="loading" @send="handleSend" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
}

.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
  gap: 1rem;
}
.headerLeft { display: flex; align-items: center; gap: 0.75rem; }
.headerRight { display: flex; align-items: center; gap: 0.75rem; }


.logo {
  display: flex;
  align-items: center;
  filter: drop-shadow(0 0 10px rgba(124, 106, 247, 0.5));
}

.title { 
  font-size: 1.1rem; 
  font-weight: 700; 
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.subtitle { font-size: 0.72rem; color: var(--text-muted); margin-top: 1px; }

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 4px 10px;
  border-radius: 999px;
}
.dot { 
  width: 7px; 
  height: 7px; 
  border-radius: 50%; 
  animation: pulse 2s infinite;
}

.clearBtn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.clearBtn:hover { 
  color: var(--error); 
  border-color: var(--error);
  background: rgba(255, 87, 87, 0.08);
}

.messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 1.5rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  scroll-behavior: smooth;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  animation: fadeIn 0.5s ease;
}
.emptyIcon { 
  font-size: 2.5rem; 
  color: var(--accent-primary); 
  margin-bottom: 1rem; 
  filter: drop-shadow(0 0 12px var(--accent-primary));
}
.emptyTitle { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; }
.emptyText { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; }

.kbd {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.75rem;
}

.suggestGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; width: 100%; max-width: 540px; }
.suggest {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  line-height: 1.4;
  font-size: 0.82rem;
  font-family: inherit;
}
.suggest:hover { 
  border-color: var(--border-accent); 
  color: var(--text-primary); 
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

.errorBanner {
  background: rgba(255,87,87,0.1);
  border: 1px solid rgba(255,87,87,0.3);
  color: var(--error);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  animation: fadeInUp 0.3s ease;
}

@media (max-width: 480px) {
  .suggestGrid { grid-template-columns: 1fr; }
  .title { font-size: 0.95rem; }
  .clearBtn span { display: none; }
}
</style>
