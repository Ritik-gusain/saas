-- supabase/schema.sql
-- The foundational Database Schema for Luminescent.io SaaS

-- 1. Create Private Schema for secure functions (prevents RLS infinite recursion)
CREATE SCHEMA IF NOT EXISTS private;

-- 2. Create Teams Table (The core billing entity)
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan_tier INT NOT NULL DEFAULT 3, -- Seats limit: 3, 7, or 12
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Team Members Table (The relationship entity)
CREATE TABLE public.team_members (
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. Create Secure Functions for RLS logic
CREATE OR REPLACE FUNCTION private.is_team_member(check_team_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION private.is_team_owner(check_team_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id AND user_id = auth.uid() AND role = 'owner'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. Create RPC for fast team creation via frontend
CREATE OR REPLACE FUNCTION public.create_team(team_name TEXT, tier INT)
RETURNS UUID AS $$
DECLARE
  new_team_id UUID;
BEGIN
  -- Insert Team
  INSERT INTO public.teams (name, plan_tier) 
  VALUES (team_name, tier) 
  RETURNING id INTO new_team_id;

  -- Insert Owner
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (new_team_id, auth.uid(), 'owner');

  RETURN new_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Policies for Teams
CREATE POLICY "Users can view their own teams" 
  ON public.teams FOR SELECT 
  USING (private.is_team_member(id));

CREATE POLICY "Owners can update their teams" 
  ON public.teams FOR UPDATE 
  USING (private.is_team_owner(id));

-- 8. Policies for Team Members
CREATE POLICY "Users can view members of their teams" 
  ON public.team_members FOR SELECT 
  USING (private.is_team_member(team_id));

CREATE POLICY "Owners can delete team members" 
  ON public.team_members FOR DELETE 
  USING (private.is_team_owner(team_id));
