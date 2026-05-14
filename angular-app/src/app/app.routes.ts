import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/chat-window/chat-window.component').then(m => m.ChatWindowComponent)
  }
];
