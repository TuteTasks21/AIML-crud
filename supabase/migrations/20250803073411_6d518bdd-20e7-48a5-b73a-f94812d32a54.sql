-- Drop the problematic policies
DROP POLICY IF EXISTS "Team admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members of their teams" ON public.team_members;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_user_team_ids(_user_id uuid)
RETURNS TABLE(team_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT tm.team_id 
  FROM public.team_members tm 
  WHERE tm.user_id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_team_admin(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.team_members tm 
    WHERE tm.user_id = _user_id 
      AND tm.team_id = _team_id 
      AND tm.role = 'admin'
  );
$$;

-- Recreate policies using the security definer functions
CREATE POLICY "Users can view team members of their teams"
ON public.team_members
FOR SELECT
USING (team_id IN (SELECT public.get_user_team_ids(auth.uid())));

CREATE POLICY "Team admins can manage team members"
ON public.team_members
FOR ALL
USING (public.is_team_admin(auth.uid(), team_id));