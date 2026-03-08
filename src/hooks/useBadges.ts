import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PHASES } from "@/data/workbooks";

export interface BadgeDef {
  key: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export const BADGE_DEFINITIONS: BadgeDef[] = [
  { key: "first-step", title: "First Step", description: "Completed your first question in any workbook", icon: "star" },
  { key: "story-teller", title: "Story Teller", description: "Completed Money Story Worksheet", icon: "book-open" },
  { key: "budget-boss", title: "Budget Boss", description: "Completed Budget Creation Workbook", icon: "bar-chart-3" },
  { key: "debt-warrior", title: "Debt Warrior", description: "Completed Debt Assessment Planner", icon: "shield" },
  { key: "phase-complete", title: "Phase Complete", description: "Completed all workbooks in a phase", icon: "award" },
  { key: "halfway-there", title: "Halfway There", description: "Reached 50% overall program completion", icon: "circle-dot" },
  { key: "tracker-queen", title: "Tracker Queen", description: "Set up all 4 core tracker sections", icon: "crown" },
  { key: "program-graduate", title: "Program Graduate", description: "Completed all 7 phases", icon: "graduation-cap" },
];

export function useBadges() {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [newBadge, setNewBadge] = useState<BadgeDef | null>(null);

  const fetchBadges = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_badges")
      .select("badge_key")
      .eq("user_id", user.id);
    setEarnedBadges(new Set(data?.map((b) => b.badge_key) || []));
  }, [user]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const awardBadge = useCallback(async (key: string) => {
    if (!user || earnedBadges.has(key)) return;
    const { error } = await supabase.from("user_badges").insert({
      user_id: user.id,
      badge_key: key,
    });
    if (!error) {
      setEarnedBadges((prev) => new Set([...prev, key]));
      const def = BADGE_DEFINITIONS.find((b) => b.key === key);
      if (def) setNewBadge(def);
    }
  }, [user, earnedBadges]);

  const checkAndAwardBadges = useCallback(async () => {
    if (!user) return;

    // Get completions
    const { data: completions } = await supabase
      .from("workbook_completions")
      .select("workbook_id")
      .eq("user_id", user.id);
    const completedIds = new Set(completions?.map((c) => c.workbook_id) || []);

    // Get responses (for first-step check)
    const { data: responses } = await supabase
      .from("workbook_responses")
      .select("workbook_id, responses")
      .eq("user_id", user.id);

    // First Step - has any response with any value
    if (responses && responses.length > 0) {
      const hasAnyAnswer = responses.some((r) => {
        const resp = r.responses as Record<string, unknown>;
        return Object.values(resp).some((v) => v !== "" && v !== null && v !== undefined);
      });
      if (hasAnyAnswer) await awardBadge("first-step");
    }

    // Specific workbook completions
    if (completedIds.has("p1-money-story")) await awardBadge("story-teller");
    if (completedIds.has("p3-budget-creation")) await awardBadge("budget-boss");
    if (completedIds.has("p4-debt-assessment")) await awardBadge("debt-warrior");

    // Phase complete - check each phase
    for (const phase of PHASES) {
      const allDone = phase.workbooks.every((w) => completedIds.has(w.id));
      if (allDone && phase.workbooks.length > 0) {
        await awardBadge("phase-complete");
        break;
      }
    }

    // Halfway there
    const totalWorkbooks = PHASES.reduce((sum, p) => sum + p.workbooks.length, 0);
    if (completedIds.size >= totalWorkbooks / 2) await awardBadge("halfway-there");

    // Program Graduate
    const allPhasesComplete = PHASES.every((p) => p.workbooks.every((w) => completedIds.has(w.id)));
    if (allPhasesComplete) await awardBadge("program-graduate");

    // Tracker Queen - check if all 4 core trackers have data
    const [budgetRes, debtRes, savingsRes, goalsRes] = await Promise.all([
      supabase.from("tracker_budget").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("tracker_debts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("tracker_savings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("tracker_goals").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    if ((budgetRes.count || 0) > 0 && (debtRes.count || 0) > 0 && (savingsRes.count || 0) > 0 && (goalsRes.count || 0) > 0) {
      await awardBadge("tracker-queen");
    }
  }, [user, awardBadge]);

  const dismissNewBadge = () => setNewBadge(null);

  return { earnedBadges, newBadge, dismissNewBadge, checkAndAwardBadges, BADGE_DEFINITIONS };
}
