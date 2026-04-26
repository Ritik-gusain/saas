"use client";

import { Search, Filter, Crown, Star, Edit, Trash2 } from 'lucide-react';

interface AdminMembersProps {
  tokensLimit: number;
}

export function AdminMembers({ tokensLimit }: AdminMembersProps) {
  const members = [
    { name: 'Ritik Gusain', email: 'ritik@luminescent.io', role: 'Owner', status: 'active', tokens: 28500, avatar: 'RG' },
    { name: 'Priya Sharma', email: 'priya@luminescent.io', role: 'Admin', status: 'active', tokens: 22100, avatar: 'PS' },
    { name: 'Arjun Mehta', email: 'arjun@luminescent.io', role: 'Member', status: 'active', tokens: 18900, avatar: 'AM' },
    { name: 'Sneha Patel', email: 'sneha@luminescent.io', role: 'Member', status: 'active', tokens: 12400, avatar: 'SP' },
    { name: 'Rahul Kumar', email: 'rahul@luminescent.io', role: 'Member', status: 'inactive', tokens: 7100, avatar: 'RK' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text"
            placeholder="Search members..."
            className="w-full glass-panel rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:ring-0 transition-all outline-none"
          />
        </div>
        <button className="glass-panel px-4 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
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
            {members.map((member) => (
              <tr key={member.email} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center text-[var(--bg)] text-xs font-bold">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{member.name}</div>
                      <div className="text-xs text-[var(--muted)]">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.role === 'Owner' && <Crown className="w-4 h-4 text-[var(--mint)]" />}
                    {member.role === 'Admin' && <Star className="w-4 h-4 text-[var(--cyan)]" />}
                    <span className="text-sm text-[var(--soft)]">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active' 
                      ? 'bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/30'
                      : 'bg-[var(--muted)]/10 text-[var(--muted)] border border-[var(--muted)]/30'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-[var(--mint)]' : 'bg-[var(--muted)]'}`} />
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white font-semibold">{member.tokens.toLocaleString()}</div>
                  <div className="text-xs text-[var(--muted)]">{((member.tokens / tokensLimit) * 100).toFixed(1)}% of limit</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group">
                      <Edit className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--cyan)]" />
                    </button>
                    {member.role !== 'Owner' && (
                      <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all group">
                        <Trash2 className="w-4 h-4 text-[var(--muted)] group-hover:text-red-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
