"use client";
import React from 'react';
import ChatDashboard from '@/components/dashboard/chat/ChatDashboard';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function FreeTierChatPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="h-screen bg-transparent">
      {/* Passing selectedPlan=0 to denote free tier */}
      <ChatDashboard selectedPlan={0} onSignOut={handleSignOut} />
    </div>
  );
}
