import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexus AI Chat',
  description: 'A premium, modern AI chat interface powered by OpenAI.',
  keywords: ['AI', 'chat', 'OpenAI', 'GPT-4', 'nextjs'],
};

import { ToasterProvider } from '../components/ToasterProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
