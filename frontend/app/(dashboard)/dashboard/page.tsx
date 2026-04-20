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
    <div className="h-screen bg-transparent">
      <ChatDashboard selectedPlan={3} onSignOut={handleSignOut} />
    </div>
  );
}
