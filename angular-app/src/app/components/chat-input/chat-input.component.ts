import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Send } from 'lucide-angular';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  @Input() disabled = false;
  @Output() send = new EventEmitter<string>();
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  content = '';
  MAX_CHARS = 2000;

  handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    if (target.value.length > this.MAX_CHARS) {
      target.value = target.value.substring(0, this.MAX_CHARS);
    }
    this.content = target.value;
    this.autoResize();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.submit();
    }
  }

  submit() {
    const trimmed = this.content.trim();
    if (!trimmed || this.disabled) return;
    this.send.emit(trimmed);
    this.content = '';
    this.textarea.nativeElement.value = '';
    this.autoResize();
  }

  private autoResize() {
    const el = this.textarea.nativeElement;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }

  get pct() {
    return (this.content.length / this.MAX_CHARS) * 100;
  }

  get nearLimit() {
    return this.content.length > this.MAX_CHARS * 0.85;
  }
}
