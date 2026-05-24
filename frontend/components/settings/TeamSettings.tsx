'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail, Key, Save, AlertCircle, Copy, RefreshCw, Hash } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { authFetch } from '@/lib/api-client';

export default function TeamSettings() {
  const { 
    currentTeam, 
    members, 
    fetchMembers, 
    inviteMember, 
    removeMember, 
    updateTeamSettings,
    isLoading,
    error 
  } = useTeamStore();

  const [inviteEmail, setInviteEmail] = useState('');
  const [teamName, setTeamName] = useState(currentTeam?.name || '');
  const [joinCode, setJoinCode] = useState(currentTeam?.join_code || '');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinCodeStatus, setJoinCodeStatus] = useState<'idle' | 'loading' | 'copied' | 'error'>('idle');
  const [joinGroupStatus, setJoinGroupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [joinGroupMsg, setJoinGroupMsg] = useState('');
  const [teamKeys, setTeamKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    openrouter: '',
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (currentTeam) {
      setTeamName(currentTeam.name);
      setJoinCode((currentTeam as any).join_code || '');
      fetchMembers(currentTeam.id);
      fetchTeamKeys();
    }
  }, [currentTeam]);

  const fetchTeamKeys = async () => {
    if (!currentTeam) return;
    try {
      const res = await authFetch(`/api/teams/${currentTeam.id}/keys`);
      if (res.ok) {
        const data = await res.json();
        setTeamKeys(data.keys);
      }
    } catch (err) {
      console.error('Failed to fetch team keys', err);
    }
  };

  const handleUpdateTeamName = async () => {
    if (!currentTeam) return;
    setStatus('saving');
    await updateTeamSettings(currentTeam.id, { name: teamName });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam || !inviteEmail) return;
    try {
      await inviteMember(currentTeam.id, inviteEmail);
      setInviteEmail('');
      alert('Invitation sent!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGenerateJoinCode = async () => {
    if (!currentTeam) return;
    setJoinCodeStatus('loading');
    try {
      const res = await authFetch('/api/teams/join', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: currentTeam.id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error); setJoinCodeStatus('idle'); return; }
      setJoinCode(data.join_code);
      setJoinCodeStatus('idle');
    } catch { setJoinCodeStatus('error'); }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setJoinCodeStatus('copied');
    setTimeout(() => setJoinCodeStatus('idle'), 2000);
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setJoinGroupStatus('loading');
    try {
      const res = await authFetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ join_code: joinCodeInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setJoinGroupMsg(data.error); setJoinGroupStatus('error'); return; }
      setJoinGroupMsg(data.message || 'Joined successfully!');
      setJoinGroupStatus('success');
      setJoinCodeInput('');
      // Refresh teams list
      const { fetchTeams } = useTeamStore.getState();
      await fetchTeams();
    } catch { setJoinGroupMsg('Failed to join team.'); setJoinGroupStatus('error'); }
  };

  const handleSaveKeys = async () => {
    if (!currentTeam) return;
    setStatus('saving');
    try {
      const res = await authFetch(`/api/teams/${currentTeam.id}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: teamKeys }),
      });
      if (res.ok) {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const toggleShow = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const isPremium = currentTeam?.plan_tier && currentTeam.plan_tier >= 3;

  if (!currentTeam) return <div className="p-8 text-white">Loading team settings...</div>;

  return (
    <div className="space-y-12">
      {/* General Settings */}
      <section className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/20 border border-[var(--cyan)]/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[var(--cyan)]" />
          </div>
          <h2 className="text-xl font-bold text-white font-[Syne]">Team Workspace</h2>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-bold text-[var(--muted)] mb-2 block">Workspace Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="flex-1 bg-[#0B0E14]/50 border border-[var(--border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--cyan)]"
              />
              <button
                onClick={handleUpdateTeamName}
                disabled={status === 'saving'}
                className="px-4 py-2 rounded-lg bg-[var(--cyan)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-50"
              >
                {status === 'saving' ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Member Management */}
      <section className={`glass-panel rounded-2xl p-8 relative overflow-hidden transition-all duration-500 ${!isPremium ? 'opacity-50' : ''}`}>
        {!isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[var(--cyan)]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Collaboration is Premium</h3>
            <p className="text-sm text-[var(--muted)] max-w-xs mb-6">
              Upgrade to Starter, Growth or Pro to invite team members and collaborate in real-time.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard/settings?tab=billing'}
              className="px-6 py-2.5 rounded-xl bg-[var(--cyan)] text-black font-black text-sm shadow-[0_0_20px_var(--cyan)]/20 hover:scale-105 transition-all"
            >
              Unlock Team Features
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--mint)]/20 border border-[var(--mint)]/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--mint)]" />
            </div>
            <h2 className="text-xl font-bold text-white font-[Syne]">Team Members</h2>
          </div>
          
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              placeholder="teammate@company.com"
              disabled={!isPremium}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-64 bg-[#0B0E14]/50 border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--mint)] disabled:opacity-30"
            />
            <button
              type="submit"
              disabled={!isPremium}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--mint)] text-[var(--bg)] font-bold text-sm hover:opacity-90 disabled:opacity-30"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </button>
          </form>
        </div>

        <div className="overflow-hidden border border-[var(--border)] rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-[#0B0E14]/50 text-xs font-bold text-[var(--muted)] uppercase">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center text-[var(--bg)] font-bold text-xs">
                        {member.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.displayName || 'Pending User'}</p>
                        <p className="text-xs text-[var(--muted)]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                      member.role === 'owner' ? 'bg-[var(--cyan)]/20 text-[var(--cyan)]' : 'bg-white/10 text-[var(--muted)]'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--muted)]">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role !== 'owner' && (
                      <button 
                        onClick={() => removeMember(currentTeam.id, member.user_id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Join by Code */}
      <section className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--mint)]/20 border border-[var(--mint)]/30 flex items-center justify-center">
            <Hash className="w-5 h-5 text-[var(--mint)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-[Syne]">Join a Group</h2>
            <p className="text-sm text-[var(--muted)]">Enter a 6-character code to join an existing team workspace.</p>
          </div>
        </div>
        <form onSubmit={handleJoinByCode} className="flex gap-2 max-w-sm">
          <input
            type="text"
            placeholder="ABC123"
            maxLength={6}
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
            className="flex-1 bg-[#0B0E14]/50 border border-[var(--border)] rounded-lg px-4 py-2 text-white uppercase tracking-widest font-mono focus:outline-none focus:border-[var(--mint)]"
          />
          <button
            type="submit"
            disabled={joinGroupStatus === 'loading' || joinCodeInput.length < 6}
            className="px-4 py-2 rounded-lg bg-[var(--mint)] text-[var(--bg)] font-bold hover:opacity-90 disabled:opacity-40"
          >
            {joinGroupStatus === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>
        {joinGroupMsg && (
          <p className={`mt-3 text-sm font-bold ${ joinGroupStatus === 'success' ? 'text-[var(--mint)]' : 'text-red-400'}`}>
            {joinGroupMsg}
          </p>
        )}
      </section>

      {/* Join Code (owner only) */}
      {isPremium && currentTeam?.owner_id && (
        <section className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Key className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-[Syne]">Team Join Code</h2>
              <p className="text-sm text-[var(--muted)]">Share this code with teammates so they can join instantly — no email needed.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#0B0E14]/50 border border-[var(--border)] rounded-xl px-6 py-4">
              {joinCode ? (
                <span className="text-3xl font-black text-white font-mono tracking-[0.5em]">{joinCode}</span>
              ) : (
                <span className="text-[var(--muted)] text-sm">No code generated yet</span>
              )}
            </div>
            {joinCode && (
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-xl bg-white/5 border border-[var(--border)] text-[var(--muted)] hover:text-white hover:bg-white/10 transition-colors"
                title="Copy code"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleGenerateJoinCode}
              disabled={joinCodeStatus === 'loading'}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-sm hover:bg-yellow-500/20 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${joinCodeStatus === 'loading' ? 'animate-spin' : ''}`} />
              {joinCode ? 'Regenerate' : 'Generate Code'}
            </button>
          </div>
          {joinCodeStatus === 'copied' && <p className="mt-2 text-xs text-[var(--mint)] font-bold">✓ Copied to clipboard!</p>}
        </section>
      )}

      {/* Team API Keys (Group BYOK) */}
      <section className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-[Syne]">Shared Group Keys</h2>
            <p className="text-sm text-[var(--muted)]">These keys will be used for all team members under the Growth/Pro plan.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {['openai', 'anthropic', 'google', 'openrouter'].map((provider) => (
            <div key={provider} className="glass-panel rounded-xl p-4 flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase">{provider} Key</label>
              <div className="relative">
                <input
                  type={showKeys[provider] ? 'text' : 'password'}
                  value={teamKeys[provider as keyof typeof teamKeys]}
                  onChange={(e) => setTeamKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full bg-[#0B0E14]/50 border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => toggleShow(provider)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                >
                  {showKeys[provider] ? <Trash2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3 text-purple-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs">Keys are encrypted at rest and never shared with team members.</p>
          </div>
          <button
            onClick={handleSaveKeys}
            disabled={status === 'saving'}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {status === 'saving' ? 'Saving...' : 'Save Team Keys'}
          </button>
        </div>
      </section>
    </div>
  );
}
