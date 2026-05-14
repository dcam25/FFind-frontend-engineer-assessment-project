import { ApplicationConfig, provideBrowserGlobalErrorListeners, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MARKED_OPTIONS, provideMarkdown, CLIPBOARD_OPTIONS, ClipboardButtonComponent } from 'ngx-markdown';
import {
  LucideAngularModule,
  LUCIDE_ICONS,
  LucideIconProvider,
  Plus,
  MessageSquare,
  Trash2,
  Hash,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Send
} from 'lucide-angular';
import remarkGfm from 'remark-gfm';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: true,
        },
      },
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
    }),
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        Plus,
        MessageSquare,
        Trash2,
        Hash,
        Edit3,
        Check,
        X,
        ChevronDown,
        ChevronRight,
        Send
      })
    }
  ]
};
