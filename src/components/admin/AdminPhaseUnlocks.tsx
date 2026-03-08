import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PHASES } from "@/data/workbooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, Loader2, Users, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MemberProfile {
  user_id: string;
  full_name: string;
}

export function AdminPhaseUnlocks() {
  const [globalUnlocks, setGlobalUnlocks] = useState<Set<number>>(new Set([1]));
  const [loading, setLoading] = useState(true);
  const [confirmPhase, setConfirmPhase] = useState<number | null>(null);
  const [unlockMode, setUnlockMode] = useState<"all" | "individual">("all");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [unlocksRes, membersRes] = await Promise.all([
        supabase.from("phase_unlocks").select("phase_number, user_id"),
        supabase.from("profiles").select("user_id, full_name"),
      ]);

      // Count how many unique users have each phase unlocked to determine "global" unlocks
      const phaseUserCounts: Record<number, number> = {};
      const totalMembers = membersRes.data?.length || 1;
      unlocksRes.data?.forEach((u) => {
        phaseUserCounts[u.phase_number] = (phaseUserCounts[u.phase_number] || 0) + 1;
      });
      const global = new Set([1]);
      Object.entries(phaseUserCounts).forEach(([phase, count]) => {
        if (count >= totalMembers * 0.5) global.add(Number(phase)); // Consider "global" if > 50% have it
      });
      setGlobalUnlocks(global);
      setMembers(membersRes.data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleUnlock = async () => {
    if (!confirmPhase) return;
    setSending(true);

    if (unlockMode === "all") {
      // Unlock for all members
      const inserts = members.map((m) => ({
        user_id: m.user_id,
        phase_number: confirmPhase,
      }));
      // Upsert to avoid duplicates
      for (const ins of inserts) {
        await supabase.from("phase_unlocks").upsert(ins, { onConflict: "user_id,phase_number" }).select();
      }
      setGlobalUnlocks((prev) => new Set([...prev, confirmPhase]));
      toast.success(`Phase ${confirmPhase} unlocked for all members!`);
    } else {
      if (!selectedMember) { setSending(false); return; }
      await supabase.from("phase_unlocks").upsert(
        { user_id: selectedMember, phase_number: confirmPhase },
        { onConflict: "user_id,phase_number" }
      );
      const member = members.find((m) => m.user_id === selectedMember);
      toast.success(`Phase ${confirmPhase} unlocked for ${member?.full_name || "member"}!`);
    }

    setSending(false);
    setConfirmPhase(null);
    setAnnouncement("");
    setSelectedMember("");
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {PHASES.map((phase) => {
          const unlocked = globalUnlocks.has(phase.number);
          return (
            <div key={phase.number} className={cn(
              "bg-card rounded-2xl border border-border p-4 shadow-card",
              unlocked && "border-primary/30"
            )}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {unlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-display font-bold">Phase {phase.number}</p>
                  <p className="text-xs text-muted-foreground font-body">{phase.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">
                {phase.workbooks.length} workbooks
              </p>
              {!unlocked && (
                <div className="flex gap-2">
                  <Button size="sm" variant="gold" className="flex-1 text-xs" onClick={() => { setConfirmPhase(phase.number); setUnlockMode("all"); }}>
                    <Users className="h-3 w-3 mr-1" /> All
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => { setConfirmPhase(phase.number); setUnlockMode("individual"); }}>
                    <User className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {unlocked && phase.number !== 1 && (
                <Badge className="text-[10px]">Unlocked</Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmPhase} onOpenChange={() => setConfirmPhase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              Unlock Phase {confirmPhase} {unlockMode === "all" ? "for All Members" : "for Individual"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {unlockMode === "individual" && (
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger>
                <SelectContent>
                  {members.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{m.full_name || "Unnamed"}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <div>
              <label className="text-sm font-body text-muted-foreground">Announcement message (optional)</label>
              <Textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write a message to include with the unlock notification..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPhase(null)}>Cancel</Button>
            <Button variant="gold" onClick={handleUnlock} disabled={sending || (unlockMode === "individual" && !selectedMember)}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock Phase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Need Badge import
import { Badge } from "@/components/ui/badge";
