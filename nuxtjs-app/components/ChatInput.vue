<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
interface Props {
  disabled: boolean;
}
defineProps<Props>();
const emit = defineEmits(['send']);

const value = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const MAX_CHARS = 2000;

const autoResize = () => {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 180) + 'px';
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (target.value.length > MAX_CHARS) {
    value.value = target.value.substring(0, MAX_CHARS);
  }
  autoResize();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
};

const submit = () => {
  const trimmed = value.value.trim();
  if (!trimmed) return;
  emit('send', trimmed);
  value.value = '';
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
      textareaRef.value.focus();
    }
  });
};

const pct = computed(() => (value.value.length / MAX_CHARS) * 100);
const nearLimit = computed(() => value.value.length > MAX_CHARS * 0.85);
</script>

<template>
  <footer class="footer">
    <form class="form" @submit.prevent="submit" aria-label="Chat input form">
      <div :class="['inputBox', disabled ? 'inputBoxDisabled' : '']">
        <textarea
          ref="textareaRef"
          v-model="value"
          id="chat-input"
          class="textarea"
          placeholder="Ask anything… (Shift+Enter for new line)"
          rows="1"
          :disabled="disabled"
          @input="handleInput"
          @keydown="handleKeyDown"
          aria-label="Chat message input"
        />

        <span v-if="nearLimit" class="charCount">
          {{ MAX_CHARS - value.length }}
        </span>

        <button
          type="submit"
          :class="['sendBtn', (!value.trim() || disabled) ? 'sendBtnDisabled' : 'sendBtnActive']"
          :disabled="!value.trim() || disabled"
          aria-label="Send message"
        >
          <span v-if="disabled" class="spinner" aria-hidden="true"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div
        class="progress"
        :style="{ width: `${pct}%`, opacity: nearLimit ? 1 : 0 }"
        role="progressbar"
        :aria-valuenow="value.length"
        :aria-valuemax="MAX_CHARS"
      />

      <p class="hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </p>
    </form>
  </footer>
</template>

<style scoped>
.footer {
  padding: 0.75rem 0 1.25rem;
  flex-shrink: 0;
  border-top: 1px solid var(--border-subtle);
  background: linear-gradient(to top, var(--bg-primary) 60%, transparent);
}
.form { position: relative; }
.inputBox {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 0.6rem 0.6rem 0.6rem 1.1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.inputBox:focus-within {
  border-color: var(--border-accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.inputBoxDisabled { opacity: 0.6; pointer-events: none; }
.textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 0.92rem;
  color: var(--text-primary);
  line-height: 1.6;
  max-height: 180px;
  overflow-y: auto;
  padding: 0.3rem 0;
}
.textarea::placeholder { color: var(--text-muted); }
.textarea::-webkit-scrollbar { width: 3px; }
.textarea::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 999px; }

.charCount {
  font-size: 0.7rem;
  color: var(--error);
  font-family: 'JetBrains Mono', monospace;
  padding: 0 0.3rem 0.4rem 0;
  align-self: flex-end;
  white-space: nowrap;
}
.sendBtn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}
.sendBtnActive {
  background: linear-gradient(135deg, #7c6af7, #a78bfa);
  color: white;
  box-shadow: 0 4px 16px rgba(124,106,247,0.5);
}
.sendBtnActive:hover { 
  transform: scale(1.08); 
  box-shadow: 0 6px 24px rgba(124,106,247,0.6);
}
.sendBtnActive:active { transform: scale(0.96); }

.sendBtnDisabled { background: var(--bg-tertiary); color: var(--text-muted); cursor: not-allowed; }
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: block;
}
.progress {
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), var(--error));
  border-radius: 999px;
  margin-top: 6px;
  transition: width 0.2s, opacity 0.3s;
}
.hint { text-align: center; font-size: 0.68rem; color: var(--text-muted); margin-top: 0.5rem; }
.hint kbd {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  padding: 1px 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
