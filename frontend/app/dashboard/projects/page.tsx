"use client";

import React, { useEffect, useState } from 'react';
import { 
  FolderPlus, Search, MoreVertical, 
  MessageSquare, Calendar, Trash2,
  ExternalLink, LayoutGrid, List,
  FolderLock, Sparkles, Hash
} from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { useProjectStore } from '@/stores/projectStore';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const { currentTeam } = useTeamStore();
  const { projects, loading, fetchProjects, createProject, deleteProject } = useProjectStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', color: '#00f2ff' });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (currentTeam?.id) {
      fetchProjects(currentTeam.id);
    }
  }, [currentTeam?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam?.id || !newProject.name) return;
    await createProject(currentTeam.id, newProject.name, newProject.description, newProject.color);
    setIsModalOpen(false);
    setNewProject({ name: '', description: '', color: '#00f2ff' });
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-transparent overflow-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white font-[Syne] mb-2">Projects</h1>
            <p className="text-sm text-[var(--muted)]">Organize your team conversations and research into dedicated workspaces.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--cyan)] transition-colors" />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/20 w-64 transition-all"
                />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] p-[1px] rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all"
             >
                <div className="bg-[var(--background)] px-4 py-2.5 rounded-[11px] flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-[var(--cyan)]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">New Project</span>
                </div>
             </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'grid' ? 'text-[var(--cyan)]' : 'text-[var(--muted)] hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'list' ? 'text-[var(--cyan)]' : 'text-[var(--muted)] hover:text-white'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
           </div>
           <p className="text-xs font-medium text-[var(--muted)]">{filteredProjects.length} Projects Total</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-panel h-64 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border-dashed">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FolderLock className="w-10 h-10 text-[var(--muted)]" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
             <p className="text-[var(--muted)] text-sm mb-8">Start by creating your first project folder.</p>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="text-[var(--cyan)] text-xs font-black uppercase tracking-widest hover:underline"
             >
               Create Project Now
             </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
            {filteredProjects.map((project) => (
              <div key={project.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan)]/5 to-[var(--purple)]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`glass-panel p-8 rounded-3xl relative overflow-hidden flex ${viewMode === 'grid' ? 'flex-col' : 'items-center justify-between'}`}>
                  {/* Folder Accent */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: project.color }}
                  />

                  <div className="flex items-start gap-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-lg"
                      style={{ backgroundColor: `${project.color}15`, border: `1px solid ${project.color}40` }}
                    >
                      <Hash className="w-6 h-6" style={{ color: project.color }} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--cyan)] transition-colors">{project.name}</h3>
                      <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4 leading-relaxed">{project.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  {viewMode === 'grid' && <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {project.conversationCount || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.createdAt ? format(new Date(project.createdAt.seconds * 1000), 'MMM d') : 'Recently'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => deleteProject(project.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                       >
                        <Trash2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl relative animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-black text-white font-[Syne] mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[var(--cyan)]" />
                New Project
              </h2>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-2">Project Name</label>
                  <input 
                    autoFocus
                    required
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    placeholder="e.g. Marketing Q3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/20"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    placeholder="What's this project about?"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-2">Theme Color</label>
                  <div className="flex gap-3">
                    {['#00f2ff', '#bd00ff', '#00ff94', '#ff0055', '#ff9900'].map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setNewProject({...newProject, color: c})}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${newProject.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-black text-[var(--muted)] uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] px-4 py-3 rounded-xl text-xs font-black text-white uppercase tracking-widest"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
