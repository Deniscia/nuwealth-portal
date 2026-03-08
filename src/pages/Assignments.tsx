import { useEffect, useState } from "react";
import { Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const PHASES = [
  { number: 1, title: "Foundation", description: "Understanding your money story" },
  { number: 2, title: "Budgeting Mastery", description: "Building your spending plan" },
  { number: 3, title: "Debt Freedom", description: "Strategic debt elimination" },
  { number: 4, title: "Investing Basics", description: "Growing your first portfolio" },
  { number: 5, title: "Wealth Building", description: "Advanced wealth strategies" },
  { number: 6, title: "Legacy Planning", description: "Protecting what you've built" },
  { number: 7, title: "Financial Freedom", description: "Living your richest life" },
];

const Assignments = () => {
  const { user } = useAuth();
  const [unlockedPhases, setUnlockedPhases] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    if (!user) return;
    supabase
      .from("phase_unlocks")
      .select("phase_number")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const set = new Set([1]); // Phase 1 always unlocked
        data?.forEach((r) => set.add(r.phase_number));
        setUnlockedPhases(set);
      });
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Assignments</h1>
        <p className="mt-1 text-muted-foreground font-body">
          Progress through each phase of your financial journey.
        </p>
      </div>

      <div className="space-y-3">
        {PHASES.map((phase) => {
          const unlocked = unlockedPhases.has(phase.number);
          return (
            <div
              key={phase.number}
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
                    unlocked
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {unlocked ? phase.number : <Lock className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground">
                    Phase {phase.number}: {phase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mt-0.5">
                    {unlocked
                      ? phase.description
                      : "This phase will be unlocked by your coach when your cohort is ready."}
                  </p>
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
    </div>
  );
};

export default Assignments;
