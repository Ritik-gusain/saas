'use client';

import { createContext, ReactNode, useContext } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SupabaseContext = createContext<ReturnType<typeof createClientComponentClient> | null>(
  null
);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();

  return (
    <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
};
