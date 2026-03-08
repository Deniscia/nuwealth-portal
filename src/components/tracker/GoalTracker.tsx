import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Edit2, Archive, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Goal {
  id?: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  target_date: string | null;
  status: string;
}

const MILESTONE_PCTS = [25, 50, 75, 100];

export function GoalTracker() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("tracker_goals").select("*").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data) setGoals(data.map(d => ({ ...d, target_amount: Number(d.target_amount), current_amount: Number(d.current_amount), monthly_contribution: Number(d.monthly_contribution) })));
      setLoading(false);
    });
  }, [user]);

  const addGoal = () => {
    setGoals(p => [...p, { goal_name: "", target_amount: 0, current_amount: 0, monthly_contribution: 0, target_date: null, status: "active" }]);
    setEditingIdx(goals.length);
  };

  const updateGoal = (i: number, field: keyof Goal, val: any) => setGoals(p => p.map((g, idx) => idx === i ? { ...g, [field]: val } : g));
  const archiveGoal = (i: number) => updateGoal(i, "status", "archived");
  const deleteGoal = (i: number) => setGoals(p => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("tracker_goals").delete().eq("user_id", user.id);
    if (goals.length > 0) {
      const { error } = await supabase.from("tracker_goals").insert(goals.map(g => ({ ...g, user_id: user.id, id: undefined })));
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
    }
    toast.success("Goals saved!");
    setEditingIdx(null);
    setSaving(false);
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const archivedGoals = goals.filter(g => g.status === "archived");

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Active Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGoals.map((goal, i) => {
          const globalIdx = goals.indexOf(goal);
          const pct = goal.target_amount > 0 ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0;
          const isEditing = editingIdx === globalIdx;
          const reachedMilestone = MILESTONE_PCTS.find(m => pct >= m && pct < m + 5);
          const circumference = 2 * Math.PI * 40;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          return (
            <div key={globalIdx} className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div><Label className="text-xs font-body text-muted-foreground">Goal Name</Label>
                    <Input value={goal.goal_name} onChange={e => updateGoal(globalIdx, "goal_name", e.target.value)} className="h-9 text-sm" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs font-body text-muted-foreground">Target</Label>
                      <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <Input type="number" value={goal.target_amount || ""} onChange={e => updateGoal(globalIdx, "target_amount", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                    <div><Label className="text-xs font-body text-muted-foreground">Current</Label>
                      <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <Input type="number" value={goal.current_amount || ""} onChange={e => updateGoal(globalIdx, "current_amount", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                    <div><Label className="text-xs font-body text-muted-foreground">Monthly</Label>
                      <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <Input type="number" value={goal.monthly_contribution || ""} onChange={e => updateGoal(globalIdx, "monthly_contribution", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                    <div><Label className="text-xs font-body text-muted-foreground">Target Date</Label>
                      <Input type="date" value={goal.target_date || ""} onChange={e => updateGoal(globalIdx, "target_date", e.target.value)} className="h-9 text-sm" /></div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingIdx(null)}>Done Editing</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    {/* Progress Ring */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-display font-bold text-foreground">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-foreground truncate">{goal.goal_name || "Untitled Goal"}</h4>
                      <p className="text-sm text-muted-foreground font-body">
                        ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                      </p>
                      {goal.monthly_contribution > 0 && (
                        <p className="text-xs text-muted-foreground font-body">
                          ${goal.monthly_contribution.toLocaleString()}/mo
                          {goal.target_amount > goal.current_amount && ` · ~${Math.ceil((goal.target_amount - goal.current_amount) / goal.monthly_contribution)} mo left`}
                        </p>
                      )}
                    </div>
                  </div>

                  {pct >= 100 && (
                    <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
                      <PartyPopper className="h-4 w-4 text-primary" />
                      <span className="text-sm font-body font-semibold text-primary">Goal achieved! 🎉</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingIdx(globalIdx)} className="gap-1 text-xs">
                      <Edit2 className="h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => archiveGoal(globalIdx)} className="gap-1 text-xs">
                      <Archive className="h-3 w-3" /> Archive
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteGoal(globalIdx)} className="gap-1 text-xs text-destructive">
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={addGoal} className="gap-2"><Plus className="h-4 w-4" /> Add Goal</Button>
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Goals
        </Button>
      </div>

      {/* Archived */}
      {archivedGoals.length > 0 && (
        <div>
          <button onClick={() => setShowArchived(p => !p)} className="text-xs text-muted-foreground hover:text-foreground font-body">
            {showArchived ? "Hide" : "Show"} archived goals ({archivedGoals.length})
          </button>
          {showArchived && (
            <div className="mt-3 space-y-2">
              {archivedGoals.map((g, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-3 flex items-center justify-between opacity-60">
                  <span className="text-sm font-body text-foreground">{g.goal_name}</span>
                  <span className="text-xs text-muted-foreground">${g.current_amount.toLocaleString()} / ${g.target_amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
