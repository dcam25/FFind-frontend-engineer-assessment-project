<script setup lang="ts">
import { marked } from 'marked';
import { toast } from 'vue-sonner';

interface Props {
  message: {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
    isError?: boolean;
  };
}

const props = defineProps<Props>();

const isUser = computed(() => props.message.role === 'user');
const time = computed(() => new Date(props.message.timestamp).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
}));

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const language = lang || 'text';
  return `
    <div class="codeWrapper">
      <div class="codeHeader">
        <span class="codeLang">${language}</span>
        <button class="copyBtn" data-code="${encodeURIComponent(text)}">Copy</button>
      </div>
      <pre><code class="language-${language}">${text}</code></pre>
    </div>
  `;
};

const renderedMarkdown = computed(() => {
  if (isUser.value) return props.message.content;
  return marked(props.message.content, { renderer });
});

const handleMessageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('copyBtn')) {
    const code = decodeURIComponent(target.getAttribute('data-code') || '');
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Copied to clipboard');
    });
  }
};
</script>

<template>
  <div>
    <div :id="message.id" :class="['wrapper', isUser ? 'userWrapper' : 'aiWrapper', 'animate-in']" @click="handleMessageClick">
      <div v-if="!isUser" class="avatar" aria-hidden="true">✦</div>
      <div :class="['bubble', isUser ? 'userBubble' : 'aiBubble', message.isError ? 'errorBubble' : '']">
        <div v-if="isUser" class="userText">{{ message.content }}</div>
        <div v-else class="markdown-body" v-html="renderedMarkdown"></div>
        <time class="time" :datetime="new Date(message.timestamp).toISOString()">
          {{ time }}
        </time>
      </div>
      <div v-if="isUser" class="avatarUser" aria-hidden="true">U</div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex; 
  align-items: start;
  gap: 0.8rem;
  padding: 0.8rem 0;
  width: 100%;
  flex-shrink: 0;
  position: relative; 
  min-height: min-content; /* Force height calculation */
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.userWrapper { justify-content: flex-end; }
.aiWrapper { justify-content: flex-start; }

.avatar, .avatarUser {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar {
  background: linear-gradient(135deg, #7c6af7, #a78bfa);
  font-size: 0.85rem;
  box-shadow: 0 0 12px rgba(124,106,247,0.4);
}

.avatarUser {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.bubble {
  max-width: min(78%, 640px);
  padding: 0.85rem 1.1rem;
  border-radius: var(--radius-lg);
  position: relative;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  word-wrap: break-word; /* Crucial for overlap prevention */
}

.userBubble {
  background: var(--user-bubble);
  border-top-right-radius: var(--radius-sm);
  box-shadow: 0 4px 20px rgba(124,106,247,0.3);
  color: white;
}

.aiBubble {
  background: var(--ai-bubble);
  border: 1px solid var(--border-subtle);
  border-top-left-radius: var(--radius-sm);
  color: var(--text-primary);
}
.errorBubble {
  background: rgba(255,87,87,0.1);
  border-color: rgba(255,87,87,0.3);
}

.userText {
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
  color: #fff;
}

.time {
  display: block;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.45);
  margin-top: 0.5rem;
  text-align: right;
}
.aiBubble .time { color: var(--text-muted); }

/* Markdown specific tweaks */
:deep(.markdown-body) {
  font-size: 0.92rem;
}

/* Code block enhancements injected via marked */
:deep(.codeWrapper) {
  background: #0d0f14;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  margin: 0.75rem 0;
  overflow: hidden;
}
:deep(.codeHeader) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-tertiary);
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}
:deep(.codeLang) {
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}
:deep(.copyBtn) {
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.65rem;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.2s;
}
:deep(.copyBtn:hover) {
  background: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}
:deep(pre) { margin: 0; padding: 1rem; }

/* Typing indicator micro-animation matched to provided CSS */
:deep(.typing) {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}
:deep(.typing span) {
  width: 6px;
  height: 6px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}
:deep(.typing span:nth-child(1)) { animation-delay: -0.32s; }
:deep(.typing span:nth-child(2)) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
