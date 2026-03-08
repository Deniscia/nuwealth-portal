import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Escalation {
  id: string;
  workbook_name: string;
  question_text: string;
  member_response: string;
  member_note: string;
  status: string;
  created_at: string;
  user_id: string;
  member_name?: string;
}

const Admin = () => {
  const { role, user } = useAuth();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (role === "admin") fetchEscalations();
  }, [role]);

  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  const fetchEscalations = async () => {
    const { data } = await supabase
      .from("escalations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      // Fetch member names
      const userIds = [...new Set(data.map((e) => e.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      
      const nameMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      setEscalations(data.map((e) => ({ ...e, member_name: nameMap.get(e.user_id) || "Member" })));
    }
    setLoading(false);
  };

  const handleReply = async (escalationId: string) => {
    if (!replyText.trim() || !user) return;
    setSending(true);

    const { error: replyError } = await supabase.from("admin_replies").insert({
      escalation_id: escalationId,
      admin_user_id: user.id,
      reply_text: replyText,
    });

    if (!replyError) {
      await supabase
        .from("escalations")
        .update({ status: "Replied" })
        .eq("id", escalationId);
      
      toast.success("Reply sent!");
      setReplyingTo(null);
      setReplyText("");
      fetchEscalations();
    } else {
      toast.error("Failed to send reply.");
    }
    setSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground font-body">
          Manage escalated questions and support your members.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : escalations.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body">No escalated questions yet. All clear! ✨</p>
        </div>
      ) : (
        <div className="space-y-4">
          {escalations.map((esc) => (
            <div key={esc.id} className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-display font-semibold px-2 py-0.5 rounded-full",
                      esc.status === "New" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {esc.status}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">
                      {new Date(esc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-display font-semibold text-foreground">{esc.member_name}</p>
                  <p className="text-xs text-muted-foreground font-body">{esc.workbook_name}</p>
                </div>
                {esc.status === "New" && <Clock className="h-5 w-5 text-primary flex-shrink-0" />}
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Question</p>
                <p className="text-sm font-body text-foreground">{esc.question_text}</p>
              </div>

              {esc.member_response && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Their Response</p>
                  <p className="text-sm font-body text-foreground">{esc.member_response}</p>
                </div>
              )}

              {esc.member_note && (
                <div className="border-l-4 border-l-primary bg-primary/5 rounded-r-xl p-4 space-y-1">
                  <p className="text-xs font-display font-semibold text-primary uppercase tracking-wider">Personal Note</p>
                  <p className="text-sm font-body text-foreground">{esc.member_note}</p>
                </div>
              )}

              {replyingTo === esc.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                      Cancel
                    </Button>
                    <Button variant="gold" size="sm" onClick={() => handleReply(esc.id)} disabled={sending || !replyText.trim()}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Send Reply</>}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setReplyingTo(esc.id)} className="gap-2">
                  <MessageSquare className="h-4 w-4" /> Reply
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
