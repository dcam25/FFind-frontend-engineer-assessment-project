import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiEndpoint = '/api/chat';
  private zone = inject(NgZone);

  sendMessage(prompt: string, history: any[] = []): Observable<string> {
    return new Observable<string>(subscriber => {
      // Run the fetch outside Angular's zone to avoid unnecessary change detection ticks
      this.zone.runOutsideAngular(() => {
        fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, history })
        })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            this.zone.run(() => subscriber.error(new Error(data.error || 'Failed to fetch')));
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            this.zone.run(() => subscriber.error(new Error('No reader available')));
            return;
          }

          const decoder = new TextDecoder();
          let accumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            accumulated += decoder.decode(value, { stream: true });
            
            let displayText = accumulated;
            // Handle Next.js style JSON responses vs plain text streams
            try {
              const parsed = JSON.parse(accumulated);
              if (parsed.response) {
                displayText = parsed.response;
              }
            } catch (e) {
              // If it's a partial JSON string, try to extract the content
              if (accumulated.startsWith('{"response":"')) {
                let stripped = accumulated.substring(13);
                if (stripped.endsWith('"}')) {
                  stripped = stripped.substring(0, stripped.length - 2);
                } else if (stripped.endsWith('"')) {
                  stripped = stripped.substring(0, stripped.length - 1);
                }
                // Convert escaped newlines and quotes manually for the partial string
                stripped = stripped.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                displayText = stripped;
              }
            }

            // Re-enter Angular's zone to trigger change detection on each chunk
            this.zone.run(() => subscriber.next(displayText));
          }

          this.zone.run(() => subscriber.complete());
        })
        .catch(err => this.zone.run(() => subscriber.error(err)));
      });
    });
  }
}
