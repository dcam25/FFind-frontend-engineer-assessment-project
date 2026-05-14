'use client';

import { Toaster } from 'sonner';

export function ToasterProvider() {
  return <Toaster theme="dark" position="top-center" expand={true} richColors />;
}
