import { authFetch } from '@/lib/api-client';
import { create } from 'zustand';

export interface Message {
  id: string;
  conversation_id: string;
  user_id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  token_count?: number;
  model?: string;
  attachments?: any[];
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  team_id: string;
  user_id: string;
  project_id?: string;
  title: string;
  is_shared: boolean;
  is_pinned: boolean;
  is_archived: boolean;
  token_count: number;
  model_used: string;
  created_at: string;
  updated_at: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  tokenUsage: number;
  error: string | null;

  setCurrentConversation: (conversation: Conversation | null) => void;
  fetchConversations: (teamId: string) => Promise<void>;
  createConversation: (teamId: string, title?: string) => Promise<Conversation>;
  loadConversation: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    content: string,
    model?: string,
    attachments?: File[]
  ) => Promise<void>;
  pinConversation: (conversationId: string) => Promise<void>;
  unpinConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  shareToProject: (conversationId: string, projectId: string) => Promise<void>;
  exportConversation: (conversationId: string, format: 'pdf' | 'md' | 'json') => Promise<void>;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingContent: '',
  tokenUsage: 0,
  error: null,

  setCurrentConversation: (conversation) => set({ currentConversation: conversation, messages: [] }),

  fetchConversations: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/conversations?teamId=${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const conversations = await res.json();
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createConversation: async (teamId: string, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId, title: title || 'New Conversation' }),
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      const conversation = await res.json();
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation,
        messages: [],
        isLoading: false,
      }));
      return conversation;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  loadConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authFetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error('Failed to load conversation');
      const data = await res.json();
      set({
        currentConversation: data.conversation,
        messages: data.messages,
        tokenUsage: data.conversation.token_count,
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string, model?: string, attachments?: File[]) => {
    set({ isStreaming: true, streamingContent: '', error: null });
    try {
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('message', content);
      if (model) formData.append('model', model);
      if (attachments) {
        attachments.forEach((file) => formData.append('attachments', file));
      }

      const res = await authFetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to send message');

      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      // Stream response
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          set((state) => ({
            streamingContent: state.streamingContent + text,
          }));
        }
      }

      // Save AI response
      const responseData = await res.json();
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: responseData.messageId,
            conversation_id: conversationId,
            role: 'assistant',
            content: state.streamingContent,
            token_count: responseData.tokenCount,
            created_at: new Date().toISOString(),
          },
        ],
        tokenUsage: (state.tokenUsage || 0) + (responseData.tokenCount || 0),
        isStreaming: false,
        streamingContent: '',
      }));
    } catch (error) {
      set({ error: (error as Error).message, isStreaming: false });
    }
  },

  pinConversation: async (conversationId: string) => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}/pin`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to pin conversation');
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, is_pinned: true } : c
        ),
        currentConversation: state.currentConversation?.id === conversationId 
          ? { ...state.currentConversation, is_pinned: true }
          : state.currentConversation,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  unpinConversation: async (conversationId: string) => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}/pin`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unpin conversation');
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, is_pinned: false } : c
        ),
        currentConversation: state.currentConversation?.id === conversationId
          ? { ...state.currentConversation, is_pinned: false }
          : state.currentConversation,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  archiveConversation: async (conversationId: string) => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}/archive`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to archive conversation');
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete conversation');
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  shareToProject: async (conversationId: string, projectId: string) => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) throw new Error('Failed to share to project');
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  exportConversation: async (conversationId: string, format: 'pdf' | 'md' | 'json') => {
    try {
      const res = await authFetch(`/api/conversations/${conversationId}/export?format=${format}`);
      if (!res.ok) throw new Error('Failed to export conversation');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setError: (error) => set({ error }),
}));
