import { create } from 'zustand';
import { authFetch } from '@/lib/api-client';

export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  createdAt: any;
  conversationCount: number;
  color: string;
  isPinned?: boolean;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetchProjects: (teamId: string) => Promise<void>;
  createProject: (teamId: string, name: string, description: string, color: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  togglePin: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async (teamId) => {
    set({ loading: true });
    try {
      const res = await authFetch(`/api/projects?teamId=${teamId}`);
      if (res.ok) {
        const data = await res.json();
        set({ projects: data });
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (teamId, name, description, color) => {
    try {
      const res = await authFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ teamId, name, description, color }),
      });
      if (res.ok) {
        const newProject = await res.json();
        set({ projects: [newProject, ...get().projects] });
      }
    } catch (err) {
      console.error('Failed to create project', err);
    }
  },

  deleteProject: async (projectId) => {
    try {
      const res = await authFetch(`/api/projects?projectId=${projectId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set({ projects: get().projects.filter(p => p.id !== projectId) });
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  },

  togglePin: async (projectId) => {
    try {
      // Optimistic update
      const currentProjects = get().projects;
      const project = currentProjects.find(p => p.id === projectId);
      if (!project) return;

      const newIsPinned = !project.isPinned;
      set({
        projects: currentProjects.map(p => 
          p.id === projectId ? { ...p, isPinned: newIsPinned } : p
        )
      });

      // API call
      await authFetch(`/api/projects/pin`, {
        method: 'POST',
        body: JSON.stringify({ projectId, isPinned: newIsPinned }),
      });
    } catch (err) {
      console.error('Failed to toggle project pin', err);
    }
  },
}));
