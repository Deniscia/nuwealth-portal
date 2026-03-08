import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Investment {
  id?: string;
  account_type: string;
  institution: string;
  balance: number;
  monthly_contribution: number;
}

export function InvestmentTracker() {
  const { user, profile } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlockedPhases, setUnlockedPhases] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("tracker_investments").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("phase_unlocks").select("phase_number").eq("user_id", user.id),
    ]).then(([{ data: inv }, { data: unlocks }]) => {
      if (inv) setInvestments(inv.map(i => ({ ...i, balance: Number(i.balance), monthly_contribution: Number(i.monthly_contribution) })));
      const set = new Set([1]);
      unlocks?.forEach(u => set.add(u.phase_number));
      setUnlockedPhases(set);
      setLoading(false);
    });
  }, [user]);

  const isLocked = !unlockedPhases.has(6) && !unlockedPhases.has(7);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (isLocked) {
    return (
      <div className="text-center py-16 space-y-4">
        <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
        <h3 className="text-xl font-display font-bold text-foreground">Investment Tracker Locked</h3>
        <p className="text-muted-foreground font-body max-w-md mx-auto">
          The Investment Tracker becomes available when you reach Phase 6. Keep going — you're building an incredible foundation! 💛
        </p>
      </div>
    );
  }

  const totalPortfolio = investments.reduce((s, i) => s + i.balance, 0);
  const totalContributions = investments.reduce((s, i) => s + i.monthly_contribution, 0);

  const addInvestment = () => setInvestments(p => [...p, { account_type: "", institution: "", balance: 0, monthly_contribution: 0 }]);
  const removeInvestment = (i: number) => setInvestments(p => p.filter((_, idx) => idx !== i));
  const updateInvestment = (i: number, field: keyof Investment, val: any) => setInvestments(p => p.map((inv, idx) => idx === i ? { ...inv, [field]: val } : inv));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("tracker_investments").delete().eq("user_id", user.id);
    if (investments.length > 0) {
      const { error } = await supabase.from("tracker_investments").insert(investments.map(i => ({ ...i, user_id: user.id, id: undefined })));
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
    }
    toast.success("Investments saved!");
    setSaving(false);
  };

  const ACCOUNT_TYPES = ["401(k)", "Roth IRA", "Traditional IRA", "Brokerage", "HSA", "529 Plan", "Other"];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Total Portfolio</p>
          <p className="text-2xl font-display font-bold text-primary">${totalPortfolio.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Monthly Contributions</p>
          <p className="text-2xl font-display font-bold text-foreground">${totalContributions.toLocaleString()}</p>
        </div>
      </div>

      {/* Investment Entries */}
      <div className="space-y-3">
        {investments.map((inv, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase">Account {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => removeInvestment(i)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs font-body text-muted-foreground">Account Type</Label>
                <select value={inv.account_type} onChange={e => updateInvestment(i, "account_type", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="">Select...</option>
                  {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><Label className="text-xs font-body text-muted-foreground">Institution</Label>
                <Input value={inv.institution} onChange={e => updateInvestment(i, "institution", e.target.value)} placeholder="e.g., Vanguard" className="h-9 text-sm" /></div>
              <div><Label className="text-xs font-body text-muted-foreground">Current Balance</Label>
                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input type="number" value={inv.balance || ""} onChange={e => updateInvestment(i, "balance", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
              <div><Label className="text-xs font-body text-muted-foreground">Monthly Contribution</Label>
                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input type="number" value={inv.monthly_contribution || ""} onChange={e => updateInvestment(i, "monthly_contribution", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={addInvestment} className="gap-2"><Plus className="h-4 w-4" /> Add Account</Button>
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Investments
        </Button>
      </div>
    </div>
  );
}
