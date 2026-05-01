"use client";

import { FolderKanban, Plus, Search, Filter, MoreVertical, Star, Clock, FileText } from 'lucide-react';

export default function FreeTierProjectsPage() {
  const projects = [
    { id: 1, name: 'Q1 Marketing Campaign', files: 12, updated: '2 hours ago', starred: true, color: 'purple' },
    { id: 2, name: 'Product Launch 2024', files: 24, updated: '5 hours ago', starred: false, color: 'cyan' },
    { id: 3, name: 'Customer Research', files: 8, updated: '1 day ago', starred: true, color: 'mint' },
  ];

  return (
    <div className="h-full bg-transparent overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white font-[Syne] mb-2">My Projects</h1>
            <p className="text-sm text-[var(--muted)]">Organize your AI work and generated assets</p>
          </div>
          <button className="bg-gradient-to-br from-[var(--purple)] to-[var(--cyan)] text-[var(--bg)] px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--purple)]/20">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input 
              type="text"
              placeholder="Search my projects..."
              className="w-full glass-panel rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--purple)] focus:ring-0 transition-all outline-none"
            />
          </div>
          <button className="glass-panel px-4 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-white transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel-hover glass-panel rounded-2xl p-6 cursor-pointer border border-transparent hover:border-[var(--purple)]/30">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-[var(--${project.color})]/10 border border-[var(--${project.color})]/20 flex items-center justify-center`}>
                  <FolderKanban className={`w-6 h-6 text-[var(--${project.color})]`} />
                </div>
                <div className="flex items-center gap-2">
                  {project.starred && <Star className="w-4 h-4 text-[var(--purple)] fill-[var(--purple)]" />}
                  <button className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-all">
                    <MoreVertical className="w-4 h-4 text-[var(--muted)]" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white font-[Syne] mb-2">{project.name}</h3>

              <div className="flex items-center gap-4 text-xs text-[var(--muted)] mb-4">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {project.files}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.updated}
                </div>
              </div>

              <div className="h-px bg-[var(--border)] mb-4" />

              <button className="w-full text-sm font-semibold text-[var(--purple)] hover:text-[var(--cyan)] transition-colors">
                Open Project →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
