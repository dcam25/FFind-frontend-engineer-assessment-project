<script setup lang="ts">
import { Plus, MessageSquare, Trash2, Hash, Edit3, Check, X, ChevronDown, ChevronRight } from 'lucide-vue-next';
import type { ChatSession } from '~/types/chat';

const props = defineProps<{
  sessions: ChatSession[];
  activeId: string | null;
}>();

const emit = defineEmits(['select', 'new', 'delete', 'jump', 'rename']);

const editingId = ref<string | null>(null);
const editValue = ref('');
const expandedSessions = ref<Record<string, boolean>>({});

const startEditing = (id: string, title: string) => {
  editingId.value = id;
  editValue.value = title;
};

const saveEdit = () => {
  if (editingId.value && editValue.value.trim()) {
    emit('rename', { id: editingId.value, title: editValue.value.trim() });
  }
  editingId.value = null;
};

const toggleSessionOutline = (id: string) => {
  expandedSessions.value[id] = !expandedSessions.value[id];
};

const sortedSessions = computed(() => 
  [...props.sessions].sort((a, b) => b.updatedAt - a.updatedAt)
);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebarHeader">
      <button class="newChatBtn" @click="emit('new')">
        <Plus :size="18" />
        <span>New Chat</span>
      </button>
    </div>

    <div class="history">
      <div class="historyHeader">
        <h3 class="label">History</h3>
      </div>
      <div v-if="sessions.length === 0" class="empty">
        No threads yet
      </div>
      <div v-else class="list">
        <div 
          v-for="session in sortedSessions" 
          :key="session.id"
          class="item-wrapper"
        >
          <div
            class="item"
            :class="{ active: activeId === session.id }"
            @click="emit('select', session.id)"
          >
            <div class="itemMain">
              <button 
                class="expandBtn"
                @click.stop="toggleSessionOutline(session.id)"
              >
                <component 
                  :is="expandedSessions[session.id] ?? (activeId === session.id) ? ChevronDown : ChevronRight" 
                  :size="14" 
                />
              </button>
              <MessageSquare :size="16" class="msgIcon" />
              
              <div v-if="editingId === session.id" class="editGroup" @click.stop>
                <input 
                  v-model="editValue" 
                  class="renameInput" 
                  auto-focus 
                  @keydown.enter="saveEdit"
                  @keydown.esc="editingId = null"
                />
                <button class="iconBtn" @click="saveEdit"><Check :size="14" /></button>
              </div>
              
              <span v-else class="itemTitle">{{ session.title }}</span>
            </div>

            <div v-if="editingId !== session.id" class="actions">
              <button class="actionBtn" @click.stop="startEditing(session.id, session.title)" title="Rename">
                <Edit3 :size="14" />
              </button>
              <button
                class="actionBtn delete"
                @click.stop="emit('delete', session.id)"
                aria-label="Delete session"
                title="Delete"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>

          <!-- Outline / Explorer -->
          <div 
            v-if="(expandedSessions[session.id] ?? (activeId === session.id)) && session.messages.some(m => m.role === 'user') && editingId !== session.id" 
            class="outline"
          >
            <button 
              v-for="prompt in session.messages.filter(m => m.role === 'user')" 
              :key="prompt.id"
              class="outlineItem"
              @click="emit('jump', prompt.id)"
            >
              <Hash :size="12" />
              <span class="outlineText">{{ prompt.content }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  gap: 1.5rem;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: opacity 0.3s ease;
  overflow-x: hidden;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
}

.sidebarHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.newChatBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: transparent;
  color: var(--text-primary);
  border: 1px dashed var(--border-accent);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex: 1;
}

.newChatBtn:hover {
  background: var(--accent-glow);
  border-style: solid;
}

.history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.historyHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  font-weight: 600;
}

.empty {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  padding-top: 2rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-right: 4px;
}

.item-wrapper {
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
}

.itemMain {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.msgIcon { flex-shrink: 0; }

.expandBtn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.expandBtn:hover {
  background: rgba(255,255,255,0.05);
}

.item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.active {
  background: var(--bg-card) !important;
  color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--border-accent);
}

.itemTitle {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.item:hover .actions {
  opacity: 1;
}

.actionBtn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.actionBtn:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

.actionBtn.delete:hover {
  color: var(--error);
  background: rgba(255, 87, 87, 0.1);
}

.editGroup {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.renameInput {
  flex: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-accent);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 0.85rem;
  padding: 2px 6px;
  outline: none;
  width: 0;
}

.iconBtn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  padding: 4px;
}

.iconBtn:hover {
  color: var(--success);
}


.outline {
  margin-left: 2.4rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  margin-bottom: 8px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.outlineItem {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 6px 8px;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.outlineItem:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.outlineText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
</style>
