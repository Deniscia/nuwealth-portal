import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Search, ChevronDown, ChevronUp, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PHASES } from "@/data/workbooks";

interface Member {
  user_id: string;
  full_name: string;
  current_phase: number;
  overall_progress: number;
  streak_days: number;
  created_at: string;
  last_active_date: string | null;
  email?: string;
}

interface MemberDetail {
  completions: string[];
  responses: string[];
  badges: string[];
  trackerCounts: { budget: number; debts: number; savings: number; goals: number };
}

export function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [sortField, setSortField] = useState<"full_name" | "overall_progress" | "last_active_date">("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setMembers(data || []);
    setLoading(false);
  };

  const viewMemberDetail = async (member: Member) => {
    setSelectedMember(member);
    setDetailLoading(true);
    const [completionsRes, responsesRes, badgesRes, budgetRes, debtsRes, savingsRes, goalsRes] = await Promise.all([
      supabase.from("workbook_completions").select("workbook_id").eq("user_id", member.user_id),
      supabase.from("workbook_responses").select("workbook_id").eq("user_id", member.user_id),
      supabase.from("user_badges").select("badge_key").eq("user_id", member.user_id),
      supabase.from("tracker_budget").select("id", { count: "exact", head: true }).eq("user_id", member.user_id),
      supabase.from("tracker_debts").select("id", { count: "exact", head: true }).eq("user_id", member.user_id),
      supabase.from("tracker_savings").select("id", { count: "exact", head: true }).eq("user_id", member.user_id),
      supabase.from("tracker_goals").select("id", { count: "exact", head: true }).eq("user_id", member.user_id),
    ]);
    setMemberDetail({
      completions: completionsRes.data?.map((c) => c.workbook_id) || [],
      responses: responsesRes.data?.map((r) => r.workbook_id) || [],
      badges: badgesRes.data?.map((b) => b.badge_key) || [],
      trackerCounts: {
        budget: budgetRes.count || 0,
        debts: debtsRes.count || 0,
        savings: savingsRes.count || 0,
        goals: goalsRes.count || 0,
      },
    });
    setDetailLoading(false);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = members
    .filter((m) => m.full_name.toLowerCase().includes(search.toLowerCase()))
    .filter((m) => phaseFilter === "all" || m.current_phase === Number(phaseFilter))
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "full_name") cmp = a.full_name.localeCompare(b.full_name);
      else if (sortField === "overall_progress") cmp = a.overall_progress - b.overall_progress;
      else cmp = (a.last_active_date || "").localeCompare(b.last_active_date || "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    sortField === field ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />) : null
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter by phase" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            {PHASES.map((p) => <SelectItem key={p.number} value={String(p.number)}>Phase {p.number}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("full_name")}>Name <SortIcon field="full_name" /></TableHead>
              <TableHead>Phase</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("overall_progress")}>Progress <SortIcon field="overall_progress" /></TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("last_active_date")}>Last Active <SortIcon field="last_active_date" /></TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.user_id}>
                <TableCell className="font-display font-semibold">{m.full_name || "—"}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">Phase {m.current_phase}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${m.overall_progress}%` }} />
                    </div>
                    <span className="text-xs font-body text-muted-foreground">{m.overall_progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-body">
                  {m.last_active_date ? new Date(m.last_active_date).toLocaleDateString() : "Never"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-body">
                  {new Date(m.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => viewMemberDetail(m)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No members found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedMember?.full_name || "Member"}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : memberDetail && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-body">Phase</p>
                  <p className="font-display font-bold">{selectedMember?.current_phase}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-body">Streak</p>
                  <p className="font-display font-bold">{selectedMember?.streak_days} days</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-display font-semibold mb-2">Workbooks</h4>
                {PHASES.map((phase) => (
                  <div key={phase.number} className="mb-2">
                    <p className="text-xs font-body text-muted-foreground font-semibold">Phase {phase.number}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {phase.workbooks.map((wb) => {
                        const completed = memberDetail.completions.includes(wb.id);
                        const inProgress = !completed && memberDetail.responses.includes(wb.id);
                        return (
                          <Badge key={wb.id} variant={completed ? "default" : inProgress ? "secondary" : "outline"} className="text-[10px]">
                            {wb.title.split(" ").slice(0, 3).join(" ")}
                            {completed ? " ✓" : inProgress ? " ◐" : ""}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-display font-semibold mb-2">Tracker Setup</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(memberDetail.trackerCounts).map(([key, val]) => (
                    <div key={key} className="bg-muted rounded-lg p-2 text-xs font-body">
                      <span className="capitalize">{key}</span>: {val > 0 ? `${val} entries` : "Not started"}
                    </div>
                  ))}
                </div>
              </div>

              {memberDetail.badges.length > 0 && (
                <div>
                  <h4 className="text-sm font-display font-semibold mb-2">Badges ({memberDetail.badges.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {memberDetail.badges.map((b) => <Badge key={b} variant="default" className="text-[10px]">{b}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
