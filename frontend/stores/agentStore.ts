import { authFetch } from '../lib/api-client';
import { create } from 'zustand';

export interface ExecutionLog {
  timestamp: string;
  type: 'plan' | 'action' | 'result' | 'error' | 'completion';
  content: string;
  metadata?: Record<string, any>;
}

export interface AgentExecution {
  id: string;
  team_id: string;
  user_id: string;
  agent_type: 'research' | 'content' | 'code' | 'data' | 'workflow' | 'document';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  goal: string;
  plan: Record<string, any>;
  execution_log: ExecutionLog[];
  result?: string;
  token_used: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

interface AgentState {
  activeExecutions: AgentExecution[];
  currentExecution: AgentExecution | null;
  executionLogs: ExecutionLog[];
  isLoading: boolean;
  error: string | null;

  startExecution: (
    teamId: string,
    agentType: AgentExecution['agent_type'],
    goal: string
  ) => Promise<AgentExecution>;
  fetchPlan: (agentType: AgentExecution['agent_type'], goal: string) => Promise<Record<string, any>>;
  approvePlan: (executionId: string) => Promise<void>;
  rejectPlan: (executionId: string) => Promise<void>;
  cancelExecution: (executionId: string) => Promise<void>;
  streamExecution: (executionId: string) => Promise<void>;
  getExecution: (executionId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeExecutions: [],
  currentExecution: null,
  executionLogs: [],
  isLoading: false,
  error: null,

  startExecution: async (teamId: string, agentType: string, goal: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/agents/${agentType}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, goal }),
      });
      if (!res.ok) throw new Error('Failed to start agent execution');
      const execution = await res.json();
      set((state) => ({
        activeExecutions: [execution, ...state.activeExecutions],
        currentExecution: execution,
        isLoading: false,
      }));
      return execution;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchPlan: async (agentType: string, goal: string) => {
    try {
      const res = await authFetch(`/api/agents/${agentType}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error('Failed to fetch execution plan');
      const plan = await res.json();
      return plan;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  approvePlan: async (executionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/agents/executions/${executionId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve plan');
      const updated = await res.json();
      set((state) => ({
        currentExecution: updated,
        activeExecutions: state.activeExecutions.map((e) =>
          e.id === executionId ? updated : e
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  rejectPlan: async (executionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/agents/executions/${executionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to reject plan');
      set((state) => ({
        activeExecutions: state.activeExecutions.filter((e) => e.id !== executionId),
        currentExecution: state.currentExecution?.id === executionId ? null : state.currentExecution,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  cancelExecution: async (executionId: string) => {
    set({ isLoading: true });
    try {
      const res = await authFetch(`/api/agents/executions/${executionId}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to cancel execution');
      set((state) => ({
        activeExecutions: state.activeExecutions.map((e) =>
          e.id === executionId ? { ...e, status: 'cancelled' as const } : e
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  streamExecution: async (executionId: string) => {
    try {
      const res = await authFetch(`/api/agents/executions/${executionId}/stream`);
      if (!res.ok) throw new Error('Failed to stream execution');

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const logs: ExecutionLog[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n');
          lines.forEach((line) => {
            if (line) {
              try {
                const log = JSON.parse(line);
                logs.push(log);
              } catch (e) {
                // Handle streaming parsing errors
              }
            }
          });
        }

        set({ executionLogs: logs });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getExecution: async (executionId: string) => {
    set({ isLoading: true });
    try {
      const res = await authFetch(`/api/agents/executions/${executionId}`);
      if (!res.ok) throw new Error('Failed to fetch execution');
      const execution = await res.json();
      set({ currentExecution: execution, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setError: (error) => set({ error }),
}));
