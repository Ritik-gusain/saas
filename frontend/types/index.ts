export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Team {
  id: string;
  name: string;
  plan_tier: number; // 3, 7, 12
  created_at: string;
}
