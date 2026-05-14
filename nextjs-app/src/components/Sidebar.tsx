'use client';
import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Hash, Edit3, Check, X, PanelLeftClose, ChevronDown, ChevronRight } from 'lucide-react';
import type { ChatSession } from '@/types/chat';
import styles from './Sidebar.module.css';

interface Props {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onRename: (id: string, newTitle: string) => void;
  onJump?: (messageId: string) => void;
}

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete, onRename, onJump }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const toggleSessionOutline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(title);
  };

  const saveEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <button className={styles.newChatBtn} onClick={onNew}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className={styles.history}>
        <div className={styles.historyHeader}>
          <h3 className={styles.label}>History</h3>
        </div>
        {sessions.length === 0 ? (
          <p className={styles.empty}>No threads yet</p>
        ) : (
          <div className={styles.list}>
            {sessions
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map(session => {
                const isExpanded = expandedSessions[session.id] ?? (activeId === session.id);
                const userPrompts = session.messages.filter(m => m.role === 'user');

                return (
                  <div key={session.id} className={styles.itemWrapper}>
                    <div
                      className={`${styles.item} ${activeId === session.id ? styles.active : ''}`}
                      onClick={() => onSelect(session.id)}
                    >
                      <div className={styles.itemMain}>
                        <button 
                          className={styles.expandBtn}
                          onClick={(e) => toggleSessionOutline(session.id, e)}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <MessageSquare size={16} className={styles.msgIcon} />
                        
                        {editingId === session.id ? (
                          <div className={styles.editGroup}>
                            <input
                              autoFocus
                              className={styles.renameInput}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(e)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button className={styles.iconBtn} onClick={saveEdit}><Check size={14} /></button>
                          </div>
                        ) : (
                          <span className={styles.itemTitle}>{session.title}</span>
                        )}
                      </div>

                      {!editingId && (
                        <div className={styles.actions}>
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => startEditing(session.id, session.title, e)}
                            title="Rename"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => onDelete(session.id, e)}
                            aria-label="Delete session"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Messages Outline (Collapsible) */}
                    {isExpanded && userPrompts.length > 0 && !editingId && (
                      <div className={styles.outline}>
                        {userPrompts.slice(0, 5).map(prompt => (
                          <button 
                            key={prompt.id} 
                            className={styles.outlineItem}
                            onClick={() => onJump?.(prompt.id)}
                          >
                            <Hash size={12} />
                            <span className={styles.outlineText}>{prompt.content}</span>
                          </button>
                        ))}
                        {userPrompts.length > 5 && <span className={styles.more}>& more...</span>}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </aside>
  );
}
