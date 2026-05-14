import { Component, Input, OnChanges, Directive, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ToastService } from '../../services/toast.service';

@Directive({
  selector: '[injectCopy]',
  standalone: true
})
export class InjectCopyDirective implements AfterViewChecked {
  constructor(
    private el: ElementRef,
    private toastService: ToastService
  ) {}

  ngAfterViewChecked() {
    const pres = this.el.nativeElement.querySelectorAll('pre');
    pres.forEach((pre: HTMLElement) => {
      if (!pre.querySelector('.custom-copy-btn')) {
        pre.style.position = 'relative';
        
        const btn = document.createElement('button');
        btn.className = 'custom-copy-btn';
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="copy-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        
        btn.onclick = () => {
          const code = pre.querySelector('code')?.innerText || '';
          navigator.clipboard.writeText(code);
          btn.classList.add('copied');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="copy-icon text-success" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          this.toastService.success('Copied to clipboard');
          
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="copy-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          }, 2000);
        };
        
        pre.appendChild(btn);
      }
    });
  }
}

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, MarkdownModule, InjectCopyDirective],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.css'
})
export class MessageBubbleComponent implements OnChanges {
  @Input() message: any;
  @Input() isStreaming = false;  // true while this specific message is still being streamed
  isUser = false;
  time = '';

  ngOnChanges() {
    this.isUser = this.message.role === 'user';
    this.time = new Date(this.message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
