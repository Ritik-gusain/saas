"use client";
import React from 'react';
import ChatDashboard from '@/components/ChatDashboard';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="h-screen bg-slate-50">
      {/* Assuming they are on the 3 member plan by default for prototype */}
      <ChatDashboard selectedPlan={3} onSignOut={handleSignOut} />
    </div>
  );
}
