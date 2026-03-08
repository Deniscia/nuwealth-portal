
-- Add unique constraint on phase_unlocks for upsert support
ALTER TABLE public.phase_unlocks ADD CONSTRAINT phase_unlocks_user_phase_unique UNIQUE (user_id, phase_number);
