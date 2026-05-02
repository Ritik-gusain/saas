"use client";

import { Activity, BarChart3, Clock, Database, TrendingUp, Zap } from 'lucide-react';

export function AdminUsage() {
  const usageBreakdown = [
    { label: "Claude 3 Opus", value: 45000, color: "var(--purple)" },
    { label: "GPT-4 Turbo", value: 32000, color: "var(--cyan)" },
    { label: "Gemini 1.5 Pro", value: 12000, color: "var(--mint)" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Usage Chart Area */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-[Montserrat] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--cyan)]" />
                Token Consumption
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">API usage across all workspace models</p>
            </div>
            <select className="bg-[var(--surface)] border border-[var(--border)] text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[var(--cyan)] transition-colors">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end gap-2 mt-8">
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 55, 90, 75, 40, 60, 85, 100, 70, 50, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div 
                  className="w-full bg-[var(--surface)] rounded-t-sm group-hover:bg-gradient-to-t group-hover:from-[var(--cyan)]/20 group-hover:to-[var(--cyan)] transition-all cursor-pointer relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg)] border border-[var(--border)] px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                    ~{(height * 1500).toLocaleString()} tokens
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white font-[Montserrat] mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--mint)]" />
            Model Breakdown
          </h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {usageBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className="text-xs font-mono text-[var(--muted)]">{item.value.toLocaleString()} tkns</span>
                </div>
                <div className="h-2 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000"
                    style={{ 
                      width: `${(item.value / 89000) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Optimize Usage</p>
                <p className="text-xs text-[var(--muted)] mt-1">Switch background agents from Opus to Haiku to save up to 40% in API costs.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
