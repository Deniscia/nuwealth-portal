
-- Workbook responses: stores all field responses as JSONB per workbook per user
CREATE TABLE public.workbook_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workbook_id text NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, workbook_id)
);

-- Workbook completions: tracks which workbooks a user has completed
CREATE TABLE public.workbook_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workbook_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, workbook_id)
);

-- Enable RLS
ALTER TABLE public.workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workbook_completions ENABLE ROW LEVEL SECURITY;

-- RLS for workbook_responses
CREATE POLICY "Users can view their own responses"
  ON public.workbook_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON public.workbook_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
  ON public.workbook_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses"
  ON public.workbook_responses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for workbook_completions
CREATE POLICY "Users can view their own completions"
  ON public.workbook_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
  ON public.workbook_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions"
  ON public.workbook_completions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-update updated_at on workbook_responses
CREATE TRIGGER update_workbook_responses_updated_at
  BEFORE UPDATE ON public.workbook_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
