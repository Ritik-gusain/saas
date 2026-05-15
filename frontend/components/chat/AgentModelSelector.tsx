'use client';

import { useState, useMemo } from 'react';
import { AGENTS, AGENT_CATEGORIES, Agent } from '@/lib/agents';
import { AI_MODELS, MODEL_PROVIDERS, AIModel, FREE_MODELS } from '@/lib/models';

interface AgentModelSelectorProps {
  selectedAgentId: string;
  selectedModelId: string;
  onAgentChange: (agent: Agent) => void;
  onModelChange: (model: AIModel) => void;
  onClose: () => void;
}

export default function AgentModelSelector({
  selectedAgentId,
  selectedModelId,
  onAgentChange,
  onModelChange,
  onClose,
}: AgentModelSelectorProps) {
  const [tab, setTab] = useState<'agents' | 'models'>('agents');
  const [agentSearch, setAgentSearch] = useState('');
  const [agentCategory, setAgentCategory] = useState('All');
  const [modelSearch, setModelSearch] = useState('');
  const [modelProvider, setModelProvider] = useState('All');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filteredAgents = useMemo(() => {
    return AGENTS.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
        a.description.toLowerCase().includes(agentSearch.toLowerCase());
      const matchCat = agentCategory === 'All' || a.category === agentCategory;
      return matchSearch && matchCat;
    });
  }, [agentSearch, agentCategory]);

  const filteredModels = useMemo(() => {
    return AI_MODELS.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.provider.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(modelSearch.toLowerCase()));
      const matchProvider = modelProvider === 'All' || m.provider === modelProvider;
      const matchFree = !showFreeOnly || m.free;
      return matchSearch && matchProvider && matchFree;
    });
  }, [modelSearch, modelProvider, showFreeOnly]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
            {(['agents', 'models'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  tab === t
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {t === 'agents' ? `🤖 Agents (${AGENTS.length})` : `🧠 Models (${AI_MODELS.length})`}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
        </div>

        {/* Agents Tab */}
        {tab === 'agents' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filters */}
            <div className="px-6 py-3 border-b border-white/5 flex gap-3 flex-wrap items-center bg-white/[0.02]">
              <input
                value={agentSearch}
                onChange={e => setAgentSearch(e.target.value)}
                placeholder="Search agents..."
                className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500 transition-colors"
              />
              <div className="flex gap-2 flex-wrap">
                {['All', ...AGENT_CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAgentCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      agentCategory === cat
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
              {filteredAgents.map(agent => {
                const isSelected = agent.id === selectedAgentId;
                return (
                  <button
                    key={agent.id}
                    onClick={() => { onAgentChange(agent); onClose(); }}
                    className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'
                    }`}
                  >
                    {/* Emoji avatar */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {agent.emoji}
                    </div>
                    <span className="text-white text-xs font-semibold leading-tight">{agent.name}</span>
                    <span className="text-white/40 text-[10px] leading-snug line-clamp-2">{agent.description}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">{agent.category}</span>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                    )}
                  </button>
                );
              })}
              {filteredAgents.length === 0 && (
                <div className="col-span-full text-center text-white/30 py-16">No agents found</div>
              )}
            </div>
          </div>
        )}

        {/* Models Tab */}
        {tab === 'models' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filters */}
            <div className="px-6 py-3 border-b border-white/5 flex gap-3 flex-wrap items-center bg-white/[0.02]">
              <input
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
                placeholder="Search models or tags..."
                className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500 transition-colors"
              />
              <select
                value={modelProvider}
                onChange={e => setModelProvider(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="All">All Providers</option>
                {MODEL_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer select-none">
                <input type="checkbox" checked={showFreeOnly} onChange={e => setShowFreeOnly(e.target.checked)}
                  className="w-4 h-4 accent-violet-500" />
                Free only
              </label>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {filteredModels.map(model => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => { onModelChange(model); onClose(); }}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 text-left ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                      {model.providerLogo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold">{model.name}</span>
                        {model.free && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">FREE</span>
                        )}
                        {model.contextWindow && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{model.contextWindow}</span>
                        )}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{model.provider} · {model.description}</div>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {model.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-xs shrink-0">✓</div>
                    )}
                  </button>
                );
              })}
              {filteredModels.length === 0 && (
                <div className="text-center text-white/30 py-16">No models found</div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="text-xs text-white/30">
            {tab === 'agents' ? `${filteredAgents.length} agents` : `${filteredModels.length} models`}
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
