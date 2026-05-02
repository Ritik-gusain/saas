"use client";

import { Key, Server, Settings as SettingsIcon, Save, TerminalSquare } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';

export function AdminSettings() {
  const { teamInfo } = useTeamStore();

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      
      {/* BYOK Configuration */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden border-t-4 border-[var(--cyan)]">
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-[var(--cyan)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-[Montserrat]">Bring Your Own Key (BYOK)</h2>
            <p className="text-sm text-[var(--muted)]">Configure API keys for your team's workspace.</p>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[var(--mint)]" />
                <span className="font-semibold text-white text-sm">Anthropic API</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/20">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="password"
                defaultValue="sk-ant-api03-xxxx-xxxx-xxxx-xxxx"
                disabled
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--muted)]"
              />
              <button className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-white transition-all font-semibold">
                Update
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">Used for Claude 3 Opus and Claude 3.5 Sonnet.</p>
          </div>

          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[var(--muted)]" />
                <span className="font-semibold text-white text-sm">OpenAI API</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">Not Configured</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="password"
                placeholder="sk-proj-..."
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-white focus:border-[var(--cyan)] focus:ring-0 outline-none transition-all"
              />
              <button className="px-4 py-2 bg-[var(--cyan)] text-[var(--bg)] rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--cyan)]/20">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Preferences */}
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-[Montserrat]">Workspace Settings</h2>
            <p className="text-sm text-[var(--muted)]">Manage global preferences for {teamInfo?.name || 'your team'}.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Workspace Name</label>
            <input 
              type="text" 
              defaultValue={teamInfo?.name || "Growth Team"}
              className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Default AI Model</label>
            <select className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] outline-none transition-all appearance-none cursor-pointer">
              <option value="claude-3-opus">Claude 3 Opus (Recommended)</option>
              <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-[var(--cyan)]" />
              Global System Prompt
            </label>
            <p className="text-xs text-[var(--muted)] mb-3">
              This prompt is silently appended to all conversations in this workspace to define the agent's core identity and restrictions.
            </p>
            <textarea 
              rows={4}
              defaultValue="You are an expert AI assistant for our marketing team. Always write in a professional yet approachable tone. Never mention competitors positively."
              className="w-full glass-panel rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--cyan)] outline-none transition-all resize-y"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border)]">
            <button className="bg-gradient-to-r from-[var(--cyan)] to-[var(--mint)] text-[var(--bg)] px-8 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--cyan)]/20 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
