import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PHASES } from "@/data/workbooks";
import { useBadges } from "@/hooks/useBadges";
import { useStreakTracker, getStreakMessage } from "@/hooks/useStreakTracker";
import { BadgeCelebration } from "@/components/dashboard/BadgeCelebration";
import { PhaseRings } from "@/components/dashboard/PhaseRings";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { BadgesDisplay } from "@/components/dashboard/BadgesDisplay";
import { Flame, Sparkles, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(" ")[0] || "Queen";
  const progress = profile?.overall_progress ?? 0;
  const currentPhase = profile?.current_phase ?? 1;
  const streak = profile?.streak_days ?? 0;

  const { earnedBadges, newBadge, dismissNewBadge, checkAndAwardBadges } = useBadges();
  useStreakTracker();

  const [phaseProgress, setPhaseProgress] = useState<Record<number, { completed: number; total: number }>>({});
  const [nextWorkbook, setNextWorkbook] = useState<{ title: string; id: string; phaseNumber: number } | null>(null);
  const [longestStreak, setLongestStreak] = useState(0);
  const streakMsg = getStreakMessage(streak);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const allIds = PHASES.flatMap((p) => p.workbooks.map((w) => w.id));
      const [completionsRes, profileRes] = await Promise.all([
        supabase.from("workbook_completions").select("workbook_id").eq("user_id", user.id).in("workbook_id", allIds),
        supabase.from("profiles").select("longest_streak").eq("user_id", user.id).single(),
      ]);

      const completedSet = new Set(completionsRes.data?.map((c) => c.workbook_id) || []);
      setLongestStreak(profileRes.data?.longest_streak ?? 0);

      const prog: Record<number, { completed: number; total: number }> = {};
      let foundNext = false;
      for (const phase of PHASES) {
        const total = phase.workbooks.length;
        const completed = phase.workbooks.filter((w) => completedSet.has(w.id)).length;
        prog[phase.number] = { completed, total };

        if (!foundNext) {
          const nextW = phase.workbooks.find((w) => !completedSet.has(w.id));
          if (nextW) {
            setNextWorkbook({ title: nextW.title, id: nextW.id, phaseNumber: nextW.phaseNumber });
            foundNext = true;
          }
        }
      }
      setPhaseProgress(prog);
      checkAndAwardBadges();
    };
    fetch();
  }, [user, checkAndAwardBadges]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {newBadge && <BadgeCelebration badge={newBadge} onDismiss={dismissNewBadge} />}

      {/* Welcome */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Welcome back, {firstName} ✨
        </h1>
        <p className="mt-1 text-muted-foreground font-body">
          Your financial transformation journey continues.
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-display font-semibold text-muted-foreground">Overall Progress</span>
          <span className="text-2xl font-display font-bold text-foreground">{progress}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phase Rings */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4 text-center">Phase Progress</h3>
        <PhaseRings phaseProgress={phaseProgress} currentPhase={currentPhase} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Streak */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-sm font-display font-semibold text-muted-foreground">Current Streak</span>
          </div>
          <p className="text-4xl font-display font-bold text-foreground">{streak} <span className="text-base font-body text-muted-foreground">days</span></p>
          {longestStreak > streak && (
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Longest: {longestStreak} days
            </p>
          )}
          {streakMsg && (
            <p className="text-xs text-primary font-body font-medium mt-2">{streakMsg}</p>
          )}
        </div>

        {/* Next Up */}
        {nextWorkbook && (
          <div className="bg-card rounded-2xl shadow-card border border-border p-5">
            <span className="text-sm font-display font-semibold text-muted-foreground">Next Up</span>
            <p className="text-base font-display font-bold text-foreground mt-2">{nextWorkbook.title}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">Phase {nextWorkbook.phaseNumber}</p>
            <Button
              variant="gold"
              size="sm"
              className="mt-3 gap-1"
              onClick={() => navigate(`/assignments/workbook/${nextWorkbook.id}`)}
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Activity + Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityHeatmap />
        <BadgesDisplay earnedBadges={earnedBadges} />
      </div>

      {/* Affirmation */}
      <div className="bg-navy rounded-2xl p-6 md:p-8 text-navy-foreground">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-lg font-semibold">Today's Affirmation</h3>
            <p className="mt-2 text-navy-foreground/80 font-body leading-relaxed">
              "I am worthy of financial abundance. Every step I take builds the legacy I deserve."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
