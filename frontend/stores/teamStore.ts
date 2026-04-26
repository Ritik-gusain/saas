import { authFetch } from '@/lib/api-client';
import { create } from 'zustand';

export interface Team {
  id: string;
  name: string;
  plan_tier: 3 | 7 | 12;
  owner_id: string;
  razorpay_subscription_id?: string;
  razorpay_customer_id?: string;
  subscription_status?: string;
  current_period_start?: string;
  current_period_end?: string;
  system_prompt?: string;
  default_model?: string;
  branding_logo_url?: string;
  branding_welcome_message?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  last_active?: string;
  daily_token_usage?: number;
}

export interface RazorpaySubscription {
  id: string;
  status: 'active' | 'cancelled' | 'pending' | 'halted' | 'completed';
  current_period_start: number;
  current_period_end: number;
  plan_id: string;
  customer_id: string;
  paid_count: number;
}

interface TeamState {
  currentTeam: Team | null;
  teams: Team[];
  members: TeamMember[];
  subscription: RazorpaySubscription | null;
  isLoading: boolean;
  error: string | null;

  setCurrentTeam: (team: Team) => void;
  fetchTeams: () => Promise<void>;
  fetchMembers: (teamId: string) => Promise<void>;
  inviteMember: (teamId: string, email: string) => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  updateTeamSettings: (teamId: string, settings: Partial<Team>) => Promise<void>;
  fetchSubscription: (teamId: string) => Promise<void>;
  updateSubscription: (teamId: string, planId: string) => Promise<void>;
  cancelSubscription: (teamId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  currentTeam: null,
  teams: [],
  members: [],
  subscription: null,
  isLoading: false,
  error: null,

  setCurrentTeam: (team) => set({ currentTeam: team }),

  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch('/api/teams');
      if (!res.ok) throw new Error('Failed to fetch teams');
      const teams = await res.json();
      set({ teams, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMembers: async (teamId: string) => {
    set({ isLoading: true });
    try {
      const res = await authFetch(`/api/teams/${teamId}/members`);
      if (!res.ok) throw new Error('Failed to fetch members');
      const members = await res.json();
      set({ members, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  inviteMember: async (teamId: string, email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to invite member');
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  removeMember: async (teamId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove member');
      set((state) => ({
        members: state.members.filter((m) => m.user_id !== userId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTeamSettings: async (teamId: string, settings: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update team settings');
      const updated = await res.json();
      set((state) => ({
        currentTeam: state.currentTeam?.id === teamId ? updated : state.currentTeam,
        teams: state.teams.map((t) => (t.id === teamId ? updated : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSubscription: async (teamId: string) => {
    try {
      const res = await authFetch(`/api/razorpay/subscription?teamId=${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch subscription');
      const subscription = await res.json();
      set({ subscription });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateSubscription: async (teamId: string, planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/razorpay/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, planId }),
      });
      if (!res.ok) throw new Error('Failed to update subscription');
      const updated = await res.json();
      set({ subscription: updated, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  cancelSubscription: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/razorpay/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      if (!res.ok) throw new Error('Failed to cancel subscription');
      set({ subscription: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setError: (error) => set({ error }),
}));
