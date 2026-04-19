'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RazorpayProvider } from '@/components/providers/RazorpayProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <RazorpayProvider>{children}</RazorpayProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
