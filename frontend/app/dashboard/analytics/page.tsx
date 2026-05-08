"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, Zap, 
  MessageSquare, PieChart, ArrowUpRight, 
  ArrowDownRight, Calendar, Download,
  Sparkles, ShieldCheck, Globe
} from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { authFetch } from '@/lib/api-client';

interface Stats {
  totalMessages: number;
  totalTokens: number;
  activeUsers: number;
  dailyActivity: { date: string, count: number }[];
  modelDistribution: { name: string, value: number }[];
  costSaved: string;
}

export default function AnalyticsPage() {
  const { currentTeam } = useTeamStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTeam?.id) {
      fetchStats();
    }
  }, [currentTeam?.id]);

  const fetchStats = async () => {
    try {
      const res = await authFetch(`/api/teams/stats?teamId=${currentTeam?.id}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }: any) => (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-[40px] -mr-12 -mt-12 group-hover:bg-${color}-500/20 transition-all`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 border border-${color}-500/30 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <span className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-white font-[Syne]">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-[var(--mint)]' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm font-medium animate-pulse">Calculating metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white font-[Syne] mb-2 flex items-center gap-3">
              Analytics
              <span className="text-xs bg-[var(--cyan)]/20 text-[var(--cyan)] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter border border-[var(--cyan)]/30">
                Live
              </span>
            </h1>
            <p className="text-sm text-[var(--muted)]">Real-time usage and performance metrics for {currentTeam?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-panel px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Last 30 Days
            </button>
            <button 
              onClick={() => alert('Exporting analytics data as CSV...')}
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={MessageSquare} 
            label="Total Messages" 
            value={stats?.totalMessages.toLocaleString()} 
            trend="+12.5%" 
            trendUp={true}
            color="cyan"
          />
          <StatCard 
            icon={Zap} 
            label="Tokens Used" 
            value={(stats?.totalTokens || 0) > 1000000 ? `${((stats?.totalTokens || 0) / 1000000).toFixed(1)}M` : stats?.totalTokens.toLocaleString()} 
            trend="+8.2%" 
            trendUp={true}
            color="purple"
          />
          <StatCard 
            icon={Users} 
            label="Active Members" 
            value={stats?.activeUsers} 
            trend="Stable" 
            trendUp={true}
            color="mint"
          />
          <StatCard 
            icon={TrendingUp} 
            label="Cost Saved" 
            value={`$${stats?.costSaved}`} 
            trend="+$142 this week" 
            trendUp={true}
            color="cyan"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Chart Placeholder */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white font-[Syne]">Daily Activity</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] uppercase">
                  <div className="w-2 h-2 rounded-full bg-[var(--cyan)]" /> Messages
                </div>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {stats?.dailyActivity.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                  <div 
                    className="w-full bg-gradient-to-t from-[var(--cyan)]/40 to-[var(--cyan)] rounded-t-lg transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_20px_var(--cyan)]/30"
                    style={{ height: `${(day.count / 40) * 100}%` }}
                  />
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Distribution */}
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white font-[Syne] mb-8">Model Usage</h3>
            <div className="space-y-6">
              {stats?.modelDistribution.map((model, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className={`w-3 h-3 ${idx === 0 ? 'text-[var(--cyan)]' : idx === 1 ? 'text-[var(--purple)]' : 'text-[var(--mint)]'}`} />
                      {model.name}
                    </span>
                    <span className="text-xs font-bold text-[var(--muted)]">{model.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        idx === 0 ? 'bg-[var(--cyan)]' : idx === 1 ? 'bg-[var(--purple)]' : 'bg-[var(--mint)]'
                      }`}
                      style={{ width: `${model.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-4 bg-white/[0.03] border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-4 h-4 text-[var(--mint)]" />
                <span className="text-xs font-bold text-white">Efficiency Guard</span>
              </div>
              <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                Your team is currently optimized. Using smaller models for routine tasks has saved you approximately 14k tokens today.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[var(--cyan)]/10 flex items-center justify-center text-[var(--cyan)]">
                <Globe className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Global Reach</p>
                <p className="text-sm font-bold text-white">4 Regions Active</p>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <PieChart className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Team Balance</p>
                <p className="text-sm font-bold text-white">Equal Distribution</p>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[var(--mint)]/10 flex items-center justify-center text-[var(--mint)]">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">Performance</p>
                <p className="text-sm font-bold text-white">Ultra Fast (240ms)</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
