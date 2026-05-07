"use client";
import React, { useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTeamStore } from '@/stores/teamStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useUIStore } from '@/stores/uiStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchTeams } = useTeamStore();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[var(--bg)] overflow-hidden text-[var(--soft)] font-['Plus_Jakarta_Sans'] relative">
        {/* Subtle Background Effects to match Luminescent Theme */}
        <div className="absolute inset-0 bg-grid-texture opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cyan)] opacity-[0.02] blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />
        
        <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 bg-transparent z-10">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
