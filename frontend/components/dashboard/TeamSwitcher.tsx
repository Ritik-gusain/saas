'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Users, Check, Sparkles, Building2 } from 'lucide-react';
import { useTeamStore, Team } from '@/stores/teamStore';
import { useChatStore } from '@/stores/chatStore';
import { useRouter } from 'next/navigation';

export default function TeamSwitcher() {
  const router = useRouter();
  const { teams, currentTeam, setCurrentTeam, fetchTeams } = useTeamStore();
  const { fetchConversations } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  // Set initial team if none selected
  useEffect(() => {
    if (teams.length > 0 && !currentTeam) {
      const activeTeam = teams.find(t => t.subscription_status === 'active') || teams[0];
      handleSelect(activeTeam);
    }
  }, [teams, currentTeam]);

  const handleSelect = (team: Team) => {
    setCurrentTeam(team);
    fetchConversations(team.id);
    setIsOpen(false);
  };

  return (
    <div className="relative px-4 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all group"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--mint)]/20 border border-[var(--cyan)]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Building2 className="w-5 h-5 text-[var(--cyan)]" />
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] text-[var(--muted)] uppercase font-black tracking-widest mb-0.5">Workspace</p>
          <p className="text-sm font-bold text-white truncate font-[Syne]">
            {currentTeam?.name || 'Loading...'}
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 z-50 glass-panel rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 max-h-[300px] overflow-y-auto">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleSelect(team)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 last:mb-0 ${
                  currentTeam?.id === team.id 
                    ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20' 
                    : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                  currentTeam?.id === team.id ? 'bg-[var(--cyan)]/20' : 'bg-white/5'
                }`}>
                  {team.name[0].toUpperCase()}
                </div>
                <div className="flex-1 text-left truncate">
                  <p className="text-xs font-bold">{team.name}</p>
                  <p className="text-[10px] opacity-60">
                    {team.plan_tier === 12 ? 'Pro' : team.plan_tier === 7 ? 'Growth' : 'Starter'}
                  </p>
                </div>
                {currentTeam?.id === team.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-white/5">
            <button
              onClick={() => router.push('/dashboard/settings?section=team')}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-[var(--cyan)] hover:bg-[var(--cyan)]/5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Create New Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
