"use client";

import { Filter, CheckCircle2, UserPlus, Zap, Activity, Clock } from 'lucide-react';
import { AdminStats } from './AdminStats';

export function AdminOverview() {
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
    <div className="space-y-8">
      <AdminStats />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-[Montserrat]">Token Usage Trend</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Last 5 days</p>
            </div>
            <button className="glass-panel px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>
          <div className="space-y-4">
            {usageData.map((day) => (
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

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white font-[Montserrat] mb-6">Recent Activity</h3>
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
  );
}
