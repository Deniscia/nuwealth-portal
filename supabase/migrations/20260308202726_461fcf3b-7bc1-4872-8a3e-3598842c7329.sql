
-- Add longest_streak to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak integer NOT NULL DEFAULT 0;

-- Activity log for heatmap tracking
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  activity_type text NOT NULL DEFAULT 'login',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date, activity_type)
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity" ON public.activity_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Badges table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_key text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all badges" ON public.user_badges FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles for member management
-- Already exists

-- Allow admins to update profiles (for deactivation etc)
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert phase_unlocks for all members
-- Already exists

-- Allow admins to view all phase_unlocks
CREATE POLICY "Admins can view all phase_unlocks" ON public.phase_unlocks FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
