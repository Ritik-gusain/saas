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
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetchProjects: (teamId: string) => Promise<void>;
  createProject: (teamId: string, name: string, description: string, color: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
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
}));
