"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamStore } from '@/stores/teamStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { currentTeam, isLoading } = useTeamStore();

  useEffect(() => {
    if (isLoading) return;
    
    if (currentTeam) {
      if (currentTeam.plan_tier === 12) {
        router.push('/dashboard/pro');
      } else if (currentTeam.plan_tier === 7) {
        router.push('/dashboard/growth');
      } else if (currentTeam.plan_tier === 3) {
        router.push('/dashboard/starter');
      } else {
        router.push('/dashboard/free');
      }
    } else {
      router.push('/dashboard/free');
    }
  }, [currentTeam, isLoading, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg)]">
      <Loader2 className="w-8 h-8 text-[var(--cyan)] animate-spin" />
    </div>
  );
}
