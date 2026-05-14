import { Component, OnInit, ViewChild, ElementRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { ChatService } from '../../services/chat.service';
import { ToastService } from '../../services/toast.service';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatMessage, ChatSession } from '../../types/chat';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent, ChatInputComponent, SkeletonLoaderComponent, SidebarComponent, LucideAngularModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit {
  sessions: ChatSession[] = [];
  activeSessionId: string | null = null;
  loading = false;
  error: string | null = null;
  streamingMessageId: string | null = null;

  private storageKey = 'nexus_chat_sessions_angular';
  private chatService = inject(ChatService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private scrollRafId: number | null = null;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const input = document.querySelector('textarea') || document.querySelector('input');
      (input as HTMLElement)?.focus();
      this.toastService.info('Input focused');
    }
  }

  ngOnInit() {
    this.loadSessions();
    this.cdr.detectChanges();
  }

  get activeSession(): ChatSession | undefined {
    return this.sessions.find(s => s.id === this.activeSessionId) || this.sessions[0];
  }

  get messages(): ChatMessage[] {
    return this.activeSession?.messages || [];
  }

  isMessageStreaming(msgId: string): boolean {
    return this.streamingMessageId === msgId;
  }

  handleSend(content: string) {
    if (!content.trim() || !this.activeSessionId) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    const updatedMessages = [...this.messages, userMsg];
    this.updateActiveSession(updatedMessages);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.scheduleScroll(true);

    const aiMsgId = crypto.randomUUID();
    let isFirstChunk = true;

    this.chatService.sendMessage(content, this.messages.slice(-10)).subscribe({
      next: (accumulated) => {
        const el = this.scrollContainer?.nativeElement;
        const wasAtBottom = el ? (el.scrollHeight - el.scrollTop - el.clientHeight < 50) : true;
        const currentScrollTop = el ? el.scrollTop : 0;

        if (isFirstChunk) {
          this.loading = false;
          this.streamingMessageId = aiMsgId;
          isFirstChunk = false;
          this.cdr.detectChanges();
        }

        const aiMsg: ChatMessage = {
          id: aiMsgId,
          role: 'ai',
          content: accumulated,
          timestamp: Date.now()
        };

        const currentMessages = this.activeSession?.messages || [];
        const existingIdx = currentMessages.findIndex(m => m.id === aiMsgId);

        if (existingIdx === -1) {
          this.updateActiveSession([...updatedMessages, aiMsg]);
        } else {
          const updatedWithAi = [...currentMessages];
          updatedWithAi[existingIdx] = aiMsg;
          this.updateActiveSession(updatedWithAi);
        }

        this.cdr.detectChanges();

        if (el) {
          if (!wasAtBottom) {
            el.scrollTop = currentScrollTop;
          } else {
            el.scrollTop = el.scrollHeight;
          }
        }
      },
      error: (err) => {
        const msg = err.message || 'Error occurred';
        this.toastService.error(msg);
        this.error = msg;
        this.loading = false;
        this.streamingMessageId = null;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.streamingMessageId = null;
        this.scheduleScroll();
        this.cdr.detectChanges();
      }
    });
  }

  handleNewChat() {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    this.sessions.unshift(newSession);
    this.activeSessionId = newSession.id;
    this.saveSessions();
    this.toastService.success('New chat started');
    this.cdr.detectChanges();
  }

  handleSelectSession(id: string) {
    this.activeSessionId = id;
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToBottom(false), 50);
  }

  handleDeleteSession(id: string) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    if (this.activeSessionId === id) {
      this.activeSessionId = this.sessions[0]?.id || null;
      if (this.sessions.length === 0) {
        this.handleNewChat();
      }
    }
    this.saveSessions();
    this.toastService.info('Chat session deleted');
    this.cdr.detectChanges();
  }

  handleRenameSession(event: { id: string, title: string }) {
    this.sessions = this.sessions.map(s => s.id === event.id ? { ...s, title: event.title } : s);
    this.saveSessions();
    this.toastService.success('Session renamed');
    this.cdr.detectChanges();
  }

  handleJump(id: string) {
    const targetSession = this.sessions.find(s => s.messages.some(m => m.id === id));
    if (targetSession && this.activeSessionId !== targetSession.id) {
      this.handleSelectSession(targetSession.id);
    }

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-pulse');
        setTimeout(() => el.classList.remove('highlight-pulse'), 2000);
      }
    }, 120);
  }

  handleClear() {
    this.updateActiveSession([]);
    this.error = null;
    this.toastService.info('Chat history cleared');
    this.cdr.detectChanges();
  }

  private scheduleScroll(smooth = false) {
    if (this.scrollRafId !== null) cancelAnimationFrame(this.scrollRafId);
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollToBottom(smooth);
      this.scrollRafId = null;
    });
  }

  private scrollToBottom(smooth = false) {
    try {
      const el = this.scrollContainer.nativeElement;
      if (smooth) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {}
  }

  private updateActiveSession(newMessages: ChatMessage[]) {
    this.sessions = this.sessions.map(s =>
      s.id === this.activeSessionId
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
    this.saveSessions();
  }

  private loadSessions() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      this.sessions = JSON.parse(raw);
      this.activeSessionId = this.sessions[0]?.id || null;
      setTimeout(() => this.scrollToBottom(false), 50);
    } else {
      this.handleNewChat();
    }
  }

  private saveSessions() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.sessions));
  }
}
