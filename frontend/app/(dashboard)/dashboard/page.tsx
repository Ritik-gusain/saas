"use client";
import React from 'react';
import ChatDashboard from '@/components/ChatDashboard';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="h-screen bg-slate-50">
      {/* Assuming they are on the 3 member plan by default for prototype */}
      <ChatDashboard selectedPlan={3} onSignOut={handleSignOut} />
    </div>
  );
}
