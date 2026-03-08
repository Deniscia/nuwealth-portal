
-- Net worth snapshots
CREATE TABLE public.tracker_net_worth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assets jsonb NOT NULL DEFAULT '{}',
  liabilities jsonb NOT NULL DEFAULT '{}',
  total_assets numeric NOT NULL DEFAULT 0,
  total_liabilities numeric NOT NULL DEFAULT 0,
  net_worth numeric NOT NULL DEFAULT 0,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, recorded_at)
);

-- Debts
CREATE TABLE public.tracker_debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  creditor text NOT NULL DEFAULT '',
  balance numeric NOT NULL DEFAULT 0,
  interest_rate numeric NOT NULL DEFAULT 0,
  min_payment numeric NOT NULL DEFAULT 0,
  payoff_order integer NOT NULL DEFAULT 0,
  total_paid numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Savings funds
CREATE TABLE public.tracker_savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fund_name text NOT NULL DEFAULT '',
  target_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  monthly_contribution numeric NOT NULL DEFAULT 0,
  is_emergency_fund boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Budget items
CREATE TABLE public.tracker_budget (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'income',
  item_name text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Custom goals
CREATE TABLE public.tracker_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_name text NOT NULL DEFAULT '',
  target_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  monthly_contribution numeric NOT NULL DEFAULT 0,
  target_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Investment accounts
CREATE TABLE public.tracker_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_type text NOT NULL DEFAULT '',
  institution text NOT NULL DEFAULT '',
  balance numeric NOT NULL DEFAULT 0,
  monthly_contribution numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Investment balance history
CREATE TABLE public.tracker_investment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  investment_id uuid NOT NULL REFERENCES public.tracker_investments(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tracker_net_worth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_investment_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for all tracker tables (user can CRUD their own data)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'tracker_net_worth','tracker_debts','tracker_savings',
    'tracker_budget','tracker_goals','tracker_investments','tracker_investment_history'
  ])
  LOOP
    EXECUTE format('CREATE POLICY "Users can select own %s" ON public.%I FOR SELECT TO authenticated USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can insert own %s" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can update own %s" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can delete own %s" ON public.%I FOR DELETE TO authenticated USING (auth.uid() = user_id)', tbl, tbl);
  END LOOP;
END $$;

-- Auto-update timestamps
CREATE TRIGGER update_tracker_debts_updated_at BEFORE UPDATE ON public.tracker_debts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracker_savings_updated_at BEFORE UPDATE ON public.tracker_savings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracker_budget_updated_at BEFORE UPDATE ON public.tracker_budget FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracker_goals_updated_at BEFORE UPDATE ON public.tracker_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracker_investments_updated_at BEFORE UPDATE ON public.tracker_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
