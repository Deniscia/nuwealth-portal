import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PHASES } from "@/data/workbooks";
import { cn } from "@/lib/utils";

const Assignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unlockedPhases, setUnlockedPhases] = useState<Set<number>>(new Set([1]));
  const [phaseProgress, setPhaseProgress] = useState<Record<number, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Get unlocked phases
      const { data: unlocks } = await supabase
        .from("phase_unlocks")
        .select("phase_number")
        .eq("user_id", user.id);
      const unlockSet = new Set([1]);
      unlocks?.forEach((r) => unlockSet.add(r.phase_number));
      setUnlockedPhases(unlockSet);

      // Get all completions
      const allWorkbookIds = PHASES.flatMap((p) => p.workbooks.map((w) => w.id));
      const { data: completions } = await supabase
        .from("workbook_completions")
        .select("workbook_id")
        .eq("user_id", user.id)
        .in("workbook_id", allWorkbookIds);

      const completedSet = new Set(completions?.map((c) => c.workbook_id) || []);
      const progress: Record<number, { completed: number; total: number }> = {};
      PHASES.forEach((phase) => {
        const total = phase.workbooks.length;
        const completed = phase.workbooks.filter((w) => completedSet.has(w.id)).length;
        progress[phase.number] = { completed, total };
      });
      setPhaseProgress(progress);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Assignments</h1>
        <p className="mt-1 text-muted-foreground font-body">
          Progress through each phase of your financial journey.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {PHASES.map((phase) => {
            const unlocked = unlockedPhases.has(phase.number);
            const progress = phaseProgress[phase.number];
            const allComplete = progress && progress.completed === progress.total;

            return (
              <div
                key={phase.number}
                onClick={() => unlocked && navigate(`/assignments/${phase.number}`)}
                className={cn(
                  "bg-card rounded-2xl border border-border p-5 transition-all duration-200",
                  unlocked
                    ? "shadow-card hover:shadow-card-hover cursor-pointer"
                    : "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm",
                      allComplete
                        ? "bg-primary text-primary-foreground"
                        : unlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {allComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : unlocked ? (
                      phase.number
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground">
                      Phase {phase.number}: {phase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mt-0.5">
                      {unlocked
                        ? progress
                          ? `${progress.completed}/${progress.total} workbooks complete`
                          : phase.description
                        : "This phase will be unlocked by your coach when your cohort is ready."}
                    </p>

                    {/* Progress bar */}
                    {unlocked && progress && progress.total > 0 && (
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {unlocked ? (
                      <ChevronRight className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;
