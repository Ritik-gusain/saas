"use client";

import React, { useEffect } from 'react';
import { Star, MessageSquare, Hash, ExternalLink, Trash2 } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useProjectStore } from '@/stores/projectStore';
import { useTeamStore } from '@/stores/teamStore';
import { useRouter } from 'next/navigation';

export default function StarredPage() {
  const router = useRouter();
  const { currentTeam } = useTeamStore();
  const { conversations, loadConversation, unpinConversation } = useChatStore();
  const { projects, fetchProjects, togglePin } = useProjectStore();

  useEffect(() => {
    if (currentTeam?.id) {
      fetchProjects(currentTeam.id);
    }
  }, [currentTeam?.id, fetchProjects]);

  const starredChats = conversations.filter(c => c.is_pinned);
  const starredProjects = projects.filter(p => p.isPinned);

  return (
    <div className="h-full bg-transparent overflow-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white font-[Syne] mb-2 flex items-center gap-4">
            <Star className="w-10 h-10 text-[var(--cyan)] fill-[var(--cyan)] shadow-[0_0_20px_var(--cyan)]/30" />
            Starred Items
          </h1>
          <p className="text-sm text-[var(--muted)]">Quick access to your most important conversations and projects.</p>
        </div>

        {/* Starred Projects */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Hash className="w-5 h-5 text-[var(--purple)]" />
            Starred Projects
          </h2>
          {starredProjects.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center border-dashed">
              <p className="text-[var(--muted)] text-sm">No starred projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {starredProjects.map(project => (
                <div key={project.id} className="glass-panel p-6 rounded-2xl group relative overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}
                      >
                        <Hash className="w-5 h-5" style={{ color: project.color }} />
                      </div>
                      <h3 className="font-bold text-white group-hover:text-[var(--cyan)] transition-colors">{project.name}</h3>
                    </div>
                    <button 
                      onClick={() => togglePin(project.id)}
                      className="p-1.5 rounded-lg text-[var(--purple)] hover:bg-[var(--purple)]/10 transition-all"
                    >
                      <Star className="w-4 h-4 fill-[var(--purple)]" />
                    </button>
                  </div>
                  <button 
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Starred Chats */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[var(--cyan)]" />
            Starred Conversations
          </h2>
          {starredChats.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center border-dashed">
              <p className="text-[var(--muted)] text-sm">No starred conversations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {starredChats.map(chat => (
                <div 
                  key={chat.id} 
                  className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => {
                    loadConversation(chat.id);
                    router.push('/dashboard/chat');
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[var(--cyan)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[var(--cyan)] transition-colors">{chat.title}</h3>
                      <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-black mt-1">
                        {new Date(chat.created_at).toLocaleDateString()} • {chat.model_used}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        unpinConversation(chat.id);
                      }}
                      className="p-2 rounded-lg text-[var(--cyan)] hover:bg-[var(--cyan)]/10 transition-all"
                    >
                      <Star className="w-4 h-4 fill-[var(--cyan)]" />
                    </button>
                    <button className="p-2 rounded-lg text-[var(--muted)] hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
