import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSession } from '../../types/chat';
import { 
  LucideAngularModule, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Hash, 
  Edit3, 
  Check, 
  X, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() sessions: ChatSession[] = [];
  @Input() activeId: string | null = null;
  @Output() select = new EventEmitter<string>();
  @Output() newChat = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() jump = new EventEmitter<string>();
  @Output() rename = new EventEmitter<{ id: string, title: string }>();

  editingId: string | null = null;
  editValue = '';
  expandedSessions: Record<string, boolean> = {};

  toggleSessionOutline(id: string) {
    this.expandedSessions[id] = !this.expandedSessions[id];
  }

  sortedSessions() {
    return [...this.sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  getPrompts(session: ChatSession) {
    return session.messages.filter(m => m.role === 'user');
  }

  handleDelete(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.delete.emit(id);
  }

  startEditing(event: MouseEvent, session: ChatSession) {
    event.stopPropagation();
    this.editingId = session.id;
    this.editValue = session.title;
  }

  onInputChange(value: string) {
    this.editValue = value;
  }

  saveEdit() {
    if (this.editingId && this.editValue.trim()) {
      this.rename.emit({ id: this.editingId, title: this.editValue.trim() });
    }
    this.editingId = null;
  }
}
