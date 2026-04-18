'use client';

import { ReactNode } from 'react';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RazorpayProvider } from '@/components/providers/RazorpayProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SupabaseProvider>
            <RazorpayProvider>{children}</RazorpayProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
