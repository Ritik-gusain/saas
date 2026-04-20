"use client";

import { useState } from 'react';
import { 
  Users, TrendingUp, Activity, DollarSign, Settings, UserPlus, 
  Shield, Bell, CreditCard, BarChart3, Clock, Zap, CheckCircle2,
  XCircle, AlertCircle, ChevronRight, Download, Filter, Search,
  MoreVertical, Edit, Trash2, Crown, Star
} from 'lucide-react';

interface AdminPanelProps {
  teamData?: {
    name: string;
    plan: string;
    members: number;
    tokensUsed: number;
    tokensLimit: number;
  };
}

export default function AdminPanel({ teamData = {
  name: "Growth Team",
  plan: "Growth",
  members: 7,
  tokensUsed: 89000,
  tokensLimit: 150000
}}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'usage' | 'billing' | 'settings'>('overview');

  const stats = [
    { label: 'Total Members', value: '7', change: '+2 this month', icon: Users, color: 'cyan' },
    { label: 'Tokens Used', value: '89k', change: '59% of limit', icon: Zap, color: 'mint' },
    { label: 'Active Sessions', value: '12', change: '4 right now', icon: Activity, color: 'purple' },
    { label: 'Monthly Cost', value: '₹2,499', change: 'Next billing: Jan 15', icon: DollarSign, color: 'cyan' },
  ];

  const members = [
    { name: 'Ritik Gusain', email: 'ritik@luminescent.io', role: 'Owner', status: 'active', tokens: 28500, avatar: 'RG' },
    { name: 'Priya Sharma', email: 'priya@luminescent.io', role: 'Admin', status: 'active', tokens: 22100, avatar: 'PS' },
    { name: 'Arjun Mehta', email: 'arjun@luminescent.io', role: 'Member', status: 'active', tokens: 18900, avatar: 'AM' },
    { name: 'Sneha Patel', email: 'sneha@luminescent.io', role: 'Member', status: 'active', tokens: 12400, avatar: 'SP' },
    { name: 'Rahul Kumar', email: 'rahul@luminescent.io', role: 'Member', status: 'inactive', tokens: 7100, avatar: 'RK' },
  ];

  const usageData = [
    { date: 'Jan 10', tokens: 12500, cost: 89 },
    { date: 'Jan 11', tokens: 15200, cost: 108 },
    { date: 'Jan 12', tokens: 18900, cost: 134 },
    { date: 'Jan 13', tokens: 21400, cost: 152 },
    { date: 'Jan 14', tokens: 20900, cost: 148 },
  ];

  const recentActivity = [
    { user: 'Ritik Gusain', action: 'Created new project "Q1 Marketing"', time: '5 min ago', type: 'create' },
    { user: 'Priya Sharma', action: 'Invited new member', time: '1 hour ago', type: 'invite' },
    { user: 'Arjun Mehta', action: 'Generated 2.5k tokens', time: '2 hours ago', type: 'usage' },
    { user: 'System', action: 'Backup completed successfully', time: '3 hours ago', type: 'system' },
  ];

  return (
    <div className="h-full bg-transparent overflow-auto">
      {/* Header */}
      <div className="glass-panel border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white font-[Syne] mb-1">Admin Dashboard</h1>
              <p className="text-sm text-[var(--muted)]">Manage your team, usage, and billing</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="glass-panel px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white hover:border-[var(--cyan)] transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--cyan)]/20">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-[var(--border)] -mb-px">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'members', label: 'Team Members', icon: Users },
              { id: 'usage', label: 'Usage Analytics', icon: TrendingUp },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-[var(--cyan)]'
                      : 'text-[var(--muted)] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass-panel-hover glass-panel rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--${stat.color})]/20 to-[var(--${stat.color})]/10 border border-[var(--${stat.color})]/30 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-[var(--${stat.color})]`} />
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-all">
                        <MoreVertical className="w-4 h-4 text-[var(--muted)]" />
                      </button>
                    </div>
                    <div className="text-3xl font-black text-white font-[Syne] mb-1">{stat.value}</div>
                    <div className="text-xs text-[var(--muted)] mb-2">{stat.label}</div>
                    <div className="text-xs text-[var(--mint)] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Usage Chart & Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Usage Chart */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white font-[Syne]">Token Usage Trend</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">Last 5 days</p>
                  </div>
                  <button className="glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Filter
                  </button>
                </div>
                <div className="space-y-4">
                  {usageData.map((day, i) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="text-xs text-[var(--muted)] w-16">{day.date}</div>
                      <div className="flex-1 h-10 bg-[var(--surface)] rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] rounded-lg transition-all duration-500"
                          style={{ width: `${(day.tokens / 25000) * 100}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-white">
                          {day.tokens.toLocaleString()} tokens
                        </div>
                      </div>
                      <div className="text-xs text-[var(--muted)] w-16 text-right">₹{day.cost}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white font-[Syne] mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'create' ? 'bg-[var(--mint)]/10 border border-[var(--mint)]/30' :
                        activity.type === 'invite' ? 'bg-[var(--cyan)]/10 border border-[var(--cyan)]/30' :
                        activity.type === 'usage' ? 'bg-[var(--purple)]/10 border border-[var(--purple)]/30' :
                        'bg-[var(--surface)]'
                      }`}>
                        {activity.type === 'create' && <CheckCircle2 className="w-4 h-4 text-[var(--mint)]" />}
                        {activity.type === 'invite' && <UserPlus className="w-4 h-4 text-[var(--cyan)]" />}
                        {activity.type === 'usage' && <Zap className="w-4 h-4 text-[var(--purple)]" />}
                        {activity.type === 'system' && <Activity className="w-4 h-4 text-[var(--muted)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium">{activity.user}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{activity.action}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Search & Filter */}
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

            {/* Members Table */}
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
                  {members.map((member, i) => (
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
                        <div className="text-xs text-[var(--muted)]">{((member.tokens / teamData.tokensLimit) * 100).toFixed(1)}% of limit</div>
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
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && activeTab !== 'members' && (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-[var(--muted)]" />
            </div>
            <h3 className="text-xl font-bold text-white font-[Syne] mb-2">Coming Soon</h3>
            <p className="text-sm text-[var(--muted)]">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}
