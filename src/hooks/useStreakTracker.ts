import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useStreakTracker() {
  const { user } = useAuth();

  const trackActivity = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    // Log activity
    await supabase.from("activity_log").upsert(
      { user_id: user.id, activity_date: today, activity_type: "login" },
      { onConflict: "user_id,activity_date,activity_type" }
    );

    // Update streak
    const { data: profile } = await supabase
      .from("profiles")
      .select("streak_days, longest_streak, last_active_date")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    const lastActive = profile.last_active_date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = profile.streak_days;
    let newLongest = profile.longest_streak;

    if (lastActive === today) {
      // Already tracked today
      return;
    } else if (lastActive === yesterdayStr) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken, start over
      newStreak = 1;
    }

    if (newStreak > newLongest) newLongest = newStreak;

    await supabase.from("profiles").update({
      streak_days: newStreak,
      longest_streak: newLongest,
      last_active_date: today,
    }).eq("user_id", user.id);
  }, [user]);

  useEffect(() => {
    trackActivity();
  }, [trackActivity]);

  return { trackActivity };
}

export function getStreakMessage(days: number): string | null {
  if (days === 3) return "🔥 3-day streak! You're building momentum!";
  if (days === 7) return "🔥 One whole week! Your consistency is powerful!";
  if (days === 14) return "🔥 Two weeks strong! This is becoming a habit!";
  if (days === 30) return "🔥 30 days! You are unstoppable, Queen!";
  if (days === 60) return "🔥 60 days! Your dedication is transformational!";
  return null;
}
