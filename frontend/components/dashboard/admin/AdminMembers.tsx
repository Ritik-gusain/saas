"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, Crown, Star, Edit, Trash2, UserPlus, Mail, Loader2 } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';

interface AdminMembersProps {
  tokensLimit: number;
}

export function AdminMembers({ tokensLimit }: AdminMembersProps) {
  const { currentTeam, members, isLoading, fetchMembers, removeMember } = useTeamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (currentTeam?.id) {
      fetchMembers(currentTeam.id);
    }
  }, [currentTeam?.id, fetchMembers]);

  const maxSeats = currentTeam?.plan_tier === 7 ? 7 : currentTeam?.plan_tier === 12 ? 12 : 3;
  const usedSeats = members.length;

  const filteredMembers = members.filter(member => 
    member.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = async (userId: string) => {
    if (!currentTeam?.id) return;
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(currentTeam.id, userId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-6 border-t-4 border-[var(--cyan)]">
        <div>
          <h2 className="text-lg font-bold text-white font-[Montserrat] mb-1">Team Members</h2>
          <p className="text-sm text-[var(--muted)] flex items-center gap-2">
            Seat Utilization: <span className="text-white font-bold">{usedSeats} of {maxSeats}</span> used
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-[var(--cyan)]/10 text-[var(--cyan)] rounded border border-[var(--cyan)]/20 ml-2">
              {currentTeam?.plan_tier === 7 ? 'Growth' : currentTeam?.plan_tier === 12 ? 'Pro' : 'Starter'} Plan
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none glass-panel px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Pending Invites
          </button>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 md:flex-none bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--cyan)]/20"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-panel rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none"
          />
        </div>
        <button className="glass-panel px-4 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden min-h-[200px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--bg)]/50 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-[var(--cyan)] animate-spin" />
          </div>
        )}
        
        <table className="w-full">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Member</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Tokens Used</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center text-[var(--bg)] text-xs font-bold">
                      {member.displayName?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{member.displayName || 'Anonymous'}</div>
                      <div className="text-xs text-[var(--muted)]">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.role === 'owner' && <Crown className="w-4 h-4 text-[var(--mint)]" />}
                    {member.role === 'admin' && <Star className="w-4 h-4 text-[var(--cyan)]" />}
                    <span className="text-sm text-[var(--soft)] capitalize">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    'bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/30'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]" />
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white font-semibold">{(member.daily_token_usage || 0).toLocaleString()}</div>
                  <div className="text-xs text-[var(--muted)]">{(((member.daily_token_usage || 0) / tokensLimit) * 100).toFixed(1)}% of limit</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group" title="Edit Role">
                      <Edit className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
                    </button>
                    {member.role !== 'owner' && (
                      <button 
                        onClick={() => handleRemove(member.user_id)}
                        className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group" 
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4 text-[var(--muted)] group-hover:text-red-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-[var(--muted)]">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal 
          onClose={() => setIsInviteModalOpen(false)} 
          teamId={currentTeam?.id || ''} 
        />
      )}
    </div>
  );
}

// Inline Modal for now to keep it simple, or I can create a separate file
function InviteMemberModal({ onClose, teamId }: { onClose: () => void, teamId: string }) {
  const [email, setEmail] = useState('');
  const { inviteMember, isLoading, error, setError } = useTeamStore();
  const [inviteUrl, setInviteUrl] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In our current implementation, inviteMember doesn't return the URL 
      // because it's meant to "send email", but we updated the API to return it for debugging.
      // We should probably update the store to handle the returned inviteUrl if we want to show it.
      await inviteMember(teamId, email);
      // For now, if no error, we show success
      // Actually, I'll update the store to handle the URL.
      alert('Invitation created! (Check console for URL if you need it for testing)');
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border-t-4 border-[var(--cyan)] shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Invite Collaborator</h3>
        <p className="text-sm text-[var(--muted)] mb-6">Send an invitation to join your workspace protocol.</p>
        
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

