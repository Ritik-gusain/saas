"use client";

import { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Zap, Users, MessageSquare,
  Clock, Activity, Bot, ArrowUpRight, Calendar, Filter
} from 'lucide-react';

const DAILY_USAGE = [
  { day: 'Mon', tokens: 42000, messages: 128 },
  { day: 'Tue', tokens: 78000, messages: 204 },
  { day: 'Wed', tokens: 91000, messages: 267 },
  { day: 'Thu', tokens: 65000, messages: 189 },
  { day: 'Fri', tokens: 110000, messages: 312 },
  { day: 'Sat', tokens: 38000, messages: 98 },
  { day: 'Sun', tokens: 29000, messages: 74 },
];

const MODEL_USAGE = [
  { model: 'GPT-4o', tokens: 189000, pct: 42, color: 'var(--cyan)' },
  { model: 'Claude 3.5 Sonnet', tokens: 134000, pct: 30, color: 'var(--mint)' },
  { model: 'GPT-4 Turbo', tokens: 89000, pct: 20, color: 'var(--purple)' },
  { model: 'Gemini 1.5 Pro', tokens: 36000, pct: 8, color: '#f59e0b' },
];

const TOP_MEMBERS = [
  { name: 'Ritik G.', email: 'ritik@luminescent.io', tokens: 89000, messages: 234, role: 'owner' },
  { name: 'Priya S.', email: 'priya@luminescent.io', tokens: 67000, messages: 178, role: 'admin' },
  { name: 'Alex K.', email: 'alex@luminescent.io', tokens: 54000, messages: 143, role: 'member' },
  { name: 'Jordan M.', email: 'jordan@luminescent.io', tokens: 41000, messages: 112, role: 'member' },
];

const ACTIVITY_LOG = [
  { time: '2m ago', event: 'New conversation started', user: 'Ritik G.', type: 'chat' },
  { time: '8m ago', event: 'Team API keys updated', user: 'Ritik G.', type: 'security' },
  { time: '15m ago', event: 'Priya joined workspace', user: 'System', type: 'team' },
  { time: '1h ago', event: 'Conversation exported (MD)', user: 'Alex K.', type: 'export' },
  { time: '2h ago', event: 'Daily token limit at 78%', user: 'System', type: 'alert' },
  { time: '3h ago', event: 'New project created: Q3 Planning', user: 'Jordan M.', type: 'project' },
];

const maxTokens = Math.max(...DAILY_USAGE.map(d => d.tokens));

function StatCard({ icon: Icon, label, value, sub, trend, color }: any) {
  const isPositive = trend >= 0;
  return (
    <div className="glass-panel rounded-2xl p-6 group hover:border-[var(--cyan)]/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center`} style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-2xl font-black text-white font-[Syne]">{value}</p>
      <p className="text-xs font-bold text-white mt-1">{label}</p>
      <p className="text-[10px] text-[var(--muted)] mt-0.5">{sub}</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="h-full overflow-auto bg-transparent">
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-white font-[Syne] mb-1">Analytics</h1>
            <p className="text-sm text-[var(--muted)]">Team usage, model performance, and activity insights</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[var(--surface)] rounded-xl border border-[var(--border)] p-1">
              {(['7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === range
                      ? 'bg-[var(--cyan)] text-[var(--bg)] shadow-md'
                      : 'text-[var(--muted)] hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-white transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={Zap} label="Total Tokens Used" value="453K" sub="This week" trend={12} color="var(--cyan)" />
          <StatCard icon={MessageSquare} label="Total Messages" value="1,272" sub="Across all conversations" trend={8} color="var(--mint)" />
          <StatCard icon={Users} label="Active Members" value="4 / 7" sub="Seats utilized" trend={-5} color="var(--purple)" />
          <StatCard icon={Clock} label="Avg Response Time" value="1.8s" sub="Streaming latency" trend={15} color="#f59e0b" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Token Usage Bar Chart */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--cyan)]" />
                <h2 className="text-sm font-bold text-white">Daily Token Usage</h2>
              </div>
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Past 7 days</span>
            </div>
            <div className="flex items-end gap-3 h-44">
              {DAILY_USAGE.map((d) => {
                const heightPct = (d.tokens / maxTokens) * 100;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex flex-col justify-end" style={{ height: '160px' }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[var(--cyan)]/80 to-[var(--mint)]/60 group-hover:from-[var(--cyan)] group-hover:to-[var(--mint)] transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-[10px] text-white font-bold pointer-events-none z-10">
                        {(d.tokens / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--muted)] font-bold">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Distribution */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="w-5 h-5 text-[var(--mint)]" />
              <h2 className="text-sm font-bold text-white">Model Distribution</h2>
            </div>
            <div className="space-y-4">
              {MODEL_USAGE.map((m) => (
                <div key={m.model}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[var(--soft)] truncate max-w-[130px]">{m.model}</span>
                    <span className="text-xs font-bold text-white">{m.pct}%</span>
                  </div>
                  <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">{(m.tokens / 1000).toFixed(0)}k tokens</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Members */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-[var(--purple)]" />
              <h2 className="text-sm font-bold text-white">Top Members</h2>
            </div>
            <div className="space-y-3">
              {TOP_MEMBERS.map((m, i) => (
                <div key={m.email} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--surface)] transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--mint)] flex items-center justify-center text-[var(--bg)] font-bold text-sm flex-shrink-0">
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{m.name}</p>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        m.role === 'owner' ? 'bg-[var(--cyan)]/20 text-[var(--cyan)]'
                        : m.role === 'admin' ? 'bg-[var(--mint)]/20 text-[var(--mint)]'
                        : 'bg-white/10 text-[var(--muted)]'
                      }`}>{m.role}</span>
                    </div>
                    <p className="text-[10px] text-[var(--muted)] truncate">{m.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-white">{(m.tokens / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-[var(--muted)]">{m.messages} msgs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--cyan)]" />
                <h2 className="text-sm font-bold text-white">Activity Log</h2>
              </div>
              <button className="text-[10px] font-bold text-[var(--cyan)] hover:text-[var(--mint)] transition-colors flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              {ACTIVITY_LOG.map((log, i) => {
                const colorMap: Record<string, string> = {
                  chat: 'var(--cyan)', security: '#f59e0b',
                  team: 'var(--mint)', export: 'var(--purple)',
                  alert: '#ef4444', project: 'var(--mint)',
                };
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-all group">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colorMap[log.type] || 'var(--muted)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--soft)]">{log.event}</p>
                      <p className="text-[10px] text-[var(--muted)]">{log.user}</p>
                    </div>
                    <span className="text-[9px] text-[var(--muted)] flex-shrink-0">{log.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
