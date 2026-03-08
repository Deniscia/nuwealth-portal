
-- Escalations table
CREATE TABLE public.escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workbook_name text NOT NULL,
  question_text text NOT NULL,
  member_response text DEFAULT '',
  member_note text DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Admin replies to escalations
CREATE TABLE public.admin_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  escalation_id uuid NOT NULL REFERENCES public.escalations(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL,
  reply_text text NOT NULL,
  read_by_member boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_replies ENABLE ROW LEVEL SECURITY;

-- Escalations RLS
CREATE POLICY "Users can view their own escalations"
  ON public.escalations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own escalations"
  ON public.escalations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all escalations"
  ON public.escalations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all escalations"
  ON public.escalations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin replies RLS
CREATE POLICY "Users can view replies to their escalations"
  ON public.admin_replies FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.escalations e
    WHERE e.id = escalation_id AND e.user_id = auth.uid()
  ));

CREATE POLICY "Users can update read status on their replies"
  ON public.admin_replies FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.escalations e
    WHERE e.id = escalation_id AND e.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all replies"
  ON public.admin_replies FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert replies"
  ON public.admin_replies FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on escalations
CREATE TRIGGER update_escalations_updated_at
  BEFORE UPDATE ON public.escalations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
