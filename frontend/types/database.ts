/**
 * Database models and types for Luminescent
 * Auto-generated from Supabase schema
 */

export interface Profile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  job_title?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  plan_tier: 3 | 7 | 12;
  owner_id: string;
  razorpay_subscription_id?: string;
  razorpay_customer_id?: string;
  subscription_status: 'active' | 'cancelled' | 'pending' | 'halted' | 'completed';
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

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  color_tag?: string;
  access_type: 'all' | 'specific';
  created_by: string;
  system_prompt_override?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  team_id: string;
  user_id: string;
  agent_type: 'research' | 'content' | 'code' | 'data' | 'workflow' | 'document';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  goal: string;
  plan: Record<string, any>;
  execution_log: any[];
  result?: string;
  token_used: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface PendingInvite {
  id: string;
  team_id: string;
  email: string;
  invited_by: string;
  token: string;
  created_at: string;
  expires_at: string;
  used_at?: string;
}

export interface PromptTemplate {
  id: string;
  team_id?: string;
  created_by: string;
  title: string;
  content: string;
  category: 'Marketing' | 'Engineering' | 'Finance' | 'Legal' | 'General';
  is_personal: boolean;
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  team_id?: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface TokenUsage {
  id: string;
  team_id: string;
  user_id?: string;
  conversation_id?: string;
  agent_execution_id?: string;
  usage_type: 'chat' | 'agent' | 'image';
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  bytez_cost: number;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  sidebar_width: number;
  font_size: 'small' | 'medium' | 'large';
  chat_bubble_style: 'modern' | 'classic';
  locale: string;
  default_model: string;
  response_verbosity: 'concise' | 'detailed';
  response_language: string;
  personal_system_prompt?: string;
  code_block_theme: string;
  email_notifications: Record<string, boolean>;
  in_app_alerts: Record<string, boolean>;
  analytics_opt_out: boolean;
  api_keys?: {
    openrouter?: string;
    anthropic?: string;
    google?: string;
    openai?: string;
  };
  updated_at: string;
}
