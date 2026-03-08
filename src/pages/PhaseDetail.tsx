import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { getPhase } from "@/data/workbooks";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PhaseDetail = () => {
  const { phaseNumber } = useParams<{ phaseNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const phase = getPhase(Number(phaseNumber));
  const [completedWorkbooks, setCompletedWorkbooks] = useState<Set<string>>(new Set());
  const [inProgressWorkbooks, setInProgressWorkbooks] = useState<Set<string>>(new Set());
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !phase) return;

    const fetchData = async () => {
      // Check if phase is unlocked
      const phaseNum = Number(phaseNumber);
      if (phaseNum === 1) {
        setIsUnlocked(true);
      } else {
        const { data: unlocks } = await supabase
          .from("phase_unlocks")
          .select("phase_number")
          .eq("user_id", user.id)
          .eq("phase_number", phaseNum);
        setIsUnlocked((unlocks?.length ?? 0) > 0);
      }

      // Get completions
      const workbookIds = phase.workbooks.map((w) => w.id);
      const { data: completions } = await supabase
        .from("workbook_completions")
        .select("workbook_id")
        .eq("user_id", user.id)
        .in("workbook_id", workbookIds);
      setCompletedWorkbooks(new Set(completions?.map((c) => c.workbook_id) || []));

      // Get in-progress (has responses but not completed)
      const { data: responseData } = await supabase
        .from("workbook_responses")
        .select("workbook_id")
        .eq("user_id", user.id)
        .in("workbook_id", workbookIds);
      const completedSet = new Set(completions?.map((c) => c.workbook_id) || []);
      const inProgress = new Set(
        responseData?.filter((r) => !completedSet.has(r.workbook_id)).map((r) => r.workbook_id) || []
      );
      setInProgressWorkbooks(inProgress);
      setLoading(false);
    };

    fetchData();
  }, [user, phase, phaseNumber]);

  if (!phase) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-muted-foreground">Phase not found.</p>
      </div>
    );
  }

  if (!isUnlocked && !loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-display font-bold text-foreground">Phase {phase.number} is Locked</h1>
        <p className="text-muted-foreground font-body">
          This phase will be unlocked by your coach when your cohort is ready.
        </p>
        <Button variant="ghost" onClick={() => navigate("/assignments")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assignments
        </Button>
      </div>
    );
  }

  const getWorkbookStatus = (workbookId: string) => {
    if (completedWorkbooks.has(workbookId)) return "complete";
    if (inProgressWorkbooks.has(workbookId)) return "in_progress";
    return "not_started";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/assignments")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
            Phase {phase.number}
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">{phase.title}</h1>
          <p className="text-sm text-muted-foreground font-body">{phase.description}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {phase.workbooks.map((wb, idx) => {
            const status = getWorkbookStatus(wb.id);
            return (
              <div
                key={wb.id}
                onClick={() => navigate(`/assignments/workbook/${wb.id}`)}
                className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className="flex-shrink-0">
                    {status === "complete" ? (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                    ) : status === "in_progress" ? (
                      <div className="w-10 h-10 rounded-full border-[3px] border-primary border-t-transparent flex items-center justify-center relative">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <Circle className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground">{wb.title}</h3>
                    <p className="text-sm text-muted-foreground font-body mt-0.5">
                      {status === "complete"
                        ? "Completed ✓"
                        : status === "in_progress"
                        ? "In progress..."
                        : `${wb.sections.length} section${wb.sections.length > 1 ? "s" : ""}`}
                    </p>
                  </div>

                  <span className={cn(
                    "text-xs font-display font-semibold px-3 py-1 rounded-full",
                    status === "complete" ? "bg-primary/10 text-primary" :
                    status === "in_progress" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {status === "complete" ? "Done" : status === "in_progress" ? "Continue" : "Start"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhaseDetail;
