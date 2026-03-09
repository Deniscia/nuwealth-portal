import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getWorkbook, getPhase, getRecommendedWorkbook } from "@/data/workbooks";
import { useWorkbookData } from "@/hooks/useWorkbookData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WorkbookFieldRenderer } from "@/components/workbook/WorkbookFieldRenderer";
import { CoachChatPanel } from "@/components/workbook/CoachChatPanel";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const WorkbookPage = () => {
  const { workbookId } = useParams<{ workbookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const workbook = workbookId ? getWorkbook(workbookId) : undefined;
  const { responses, updateField, saving, lastSaved, loading, save } = useWorkbookData(workbookId || "");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOutOfOrderWarning, setShowOutOfOrderWarning] = useState(false);
  const [recommendedWorkbook, setRecommendedWorkbook] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Chat panel state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = workbook?.sections.length || 0;
  const currentSection = workbook?.sections[currentStep];

  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      updateField(fieldId, value);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => save(), 3000);
    },
    [updateField, save]
  );

  const handleOpenChat = useCallback((questionText: string) => {
    setChatQuestion(questionText);
    setChatOpen(true);
  }, []);

  const goToStep = useCallback((step: number) => {
    save();
    setCurrentStep(step);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [save]);

  useEffect(() => {
    if (!user || !workbook) return;
    supabase
      .from("workbook_completions")
      .select("workbook_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const completedIds = new Set(data?.map((d) => d.workbook_id) || []);
        if (workbookId && completedIds.has(workbookId)) setIsCompleted(true);

        const phase = getPhase(workbook.phaseNumber);
        if (phase) {
          const recommended = getRecommendedWorkbook(phase, completedIds);
          if (recommended && recommended.id !== workbookId && !completedIds.has(workbookId || "")) {
            setShowOutOfOrderWarning(true);
            setRecommendedWorkbook(recommended.title);
          }
        }
      });
  }, [user, workbook, workbookId]);

  const handleMarkComplete = async () => {
    if (!user || !workbookId) return;
    await save();
    const { error } = await supabase
      .from("workbook_completions")
      .insert({ user_id: user.id, workbook_id: workbookId });
    if (!error) {
      setIsCompleted(true);
      toast.success("Workbook marked as complete! 🎉");
    } else {
      toast.error("Failed to mark as complete. Please try again.");
    }
  };

  if (!workbook) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-muted-foreground">Workbook not found.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/assignments/${workbook.phaseNumber}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
              Phase {workbook.phaseNumber}
            </p>
            <h1 className="text-2xl font-display font-bold text-foreground">{workbook.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="h-4 w-4 text-primary" />
                <span>Saved {formatTime(lastSaved)}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Progress indicator */}
        {totalSteps > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {showOutOfOrderWarning && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-primary text-lg">⚡</span>
            <div>
              <p className="text-sm font-body text-foreground">
                We recommend completing workbooks in order for the best results. You're welcome to continue, but consider starting with{" "}
                <strong>{recommendedWorkbook}</strong> first.
              </p>
            </div>
            <button onClick={() => setShowOutOfOrderWarning(false)} className="text-muted-foreground hover:text-foreground ml-auto">
              ✕
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
            <Check className="h-5 w-5 text-primary" />
            <p className="text-sm font-body text-foreground font-medium">
              You've completed this workbook. You can still review and edit your responses.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : currentSection ? (
          <>
            <div key={animKey} className="animate-fade-in">
              <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">{currentSection.title}</h2>
                  {currentSection.description && (
                    <p className="mt-1 text-sm text-muted-foreground font-body">{currentSection.description}</p>
                  )}
                </div>
                <div className="space-y-6">
                  {currentSection.fields.map((field) => (
                    <WorkbookFieldRenderer
                      key={field.id}
                      field={field}
                      value={responses[field.id]}
                      onChange={(v) => handleFieldChange(field.id, v)}
                      onOpenChat={handleOpenChat}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              {!isFirstStep ? (
                <Button variant="outline" onClick={() => goToStep(currentStep - 1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
              ) : (
                <div />
              )}

              {isLastStep ? (
                !isCompleted ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="gold" size="lg" className="gap-2">
                        <Check className="h-5 w-5" /> Mark as Complete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-display">Complete this workbook?</AlertDialogTitle>
                        <AlertDialogDescription className="font-body">
                          Your responses will be saved and this workbook will be marked as complete. You can still edit your responses later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkComplete}>Yes, mark as complete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null
              ) : (
                <Button variant="gold" onClick={() => goToStep(currentStep + 1)} className="gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Coach Chat Panel */}
      <CoachChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        workbookName={workbook.title}
        questionText={chatQuestion}
        memberResponse={responses[chatQuestion] || ""}
      />
    </>
  );
};

export default WorkbookPage;
