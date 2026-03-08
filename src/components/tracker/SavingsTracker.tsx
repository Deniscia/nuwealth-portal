import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SavingsFund {
  id?: string;
  fund_name: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  is_emergency_fund: boolean;
}

const MILESTONES = [500, 1000, 2500, 5000];

export function SavingsTracker() {
  const { user } = useAuth();
  const [funds, setFunds] = useState<SavingsFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [celebration, setCelebration] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("tracker_savings").select("*").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data && data.length > 0) setFunds(data.map(d => ({ ...d, target_amount: Number(d.target_amount), current_amount: Number(d.current_amount), monthly_contribution: Number(d.monthly_contribution) })));
      setLoading(false);
    });
  }, [user]);

  // Auto-populate from workbook
  useEffect(() => {
    if (!user || funds.length > 0 || loading) return;
    supabase.from("workbook_responses").select("responses").eq("user_id", user.id).eq("workbook_id", "p4-savings-strategy").maybeSingle().then(({ data }) => {
      if (data?.responses) {
        const r = data.responses as Record<string, any>;
        const imported: SavingsFund[] = [];
        if (r["current-savings"] || r["monthly-contribution"]) {
          imported.push({
            fund_name: "Emergency Fund",
            target_amount: Number(r["monthly-expenses"] || 0) * (r["target-months"] === "3 months" ? 3 : r["target-months"] === "6 months" ? 6 : r["target-months"] === "9 months" ? 9 : 12),
            current_amount: Number(r["current-savings"] || 0),
            monthly_contribution: Number(r["monthly-contribution"] || 0),
            is_emergency_fund: true,
          });
        }
        if (Array.isArray(r["goal-entries"])) {
          r["goal-entries"].forEach((g: any) => {
            if (g["goal-name"]) imported.push({
              fund_name: g["goal-name"],
              target_amount: Number(g["target-amount"]) || 0,
              current_amount: 0,
              monthly_contribution: 0,
              is_emergency_fund: false,
            });
          });
        }
        if (imported.length > 0) {
          setFunds(imported);
          toast.info("Imported savings data from your workbook!");
        }
      }
    });
  }, [user, loading, funds.length]);

  const totalSaved = funds.reduce((s, f) => s + f.current_amount, 0);
  const totalMonthlySavings = funds.reduce((s, f) => s + f.monthly_contribution, 0);
  const savingsRate = monthlyIncome > 0 ? ((totalMonthlySavings / monthlyIncome) * 100).toFixed(1) : "0";
  const emergencyFund = funds.find(f => f.is_emergency_fund);

  const addFund = () => setFunds(p => [...p, { fund_name: "", target_amount: 0, current_amount: 0, monthly_contribution: 0, is_emergency_fund: false }]);
  const removeFund = (i: number) => setFunds(p => p.filter((_, idx) => idx !== i));
  const updateFund = (i: number, field: keyof SavingsFund, val: any) => setFunds(p => p.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("tracker_savings").delete().eq("user_id", user.id);
    if (funds.length > 0) {
      const { error } = await supabase.from("tracker_savings").insert(funds.map(f => ({ ...f, user_id: user.id, id: undefined })));
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
    }
    toast.success("Savings updated!");
    // Check milestones
    const milestone = MILESTONES.find(m => totalSaved >= m);
    if (milestone) {
      setCelebration(`🎉 You've saved $${milestone.toLocaleString()}!`);
      setTimeout(() => setCelebration(null), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {celebration && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <PartyPopper className="h-6 w-6 text-primary" />
          <p className="font-body font-semibold text-foreground">{celebration}</p>
        </div>
      )}

      {/* Emergency Fund */}
      {emergencyFund && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
          <h3 className="font-display font-bold text-foreground">🛡️ Emergency Fund</h3>
          <div className="relative">
            {/* Thermometer */}
            <div className="h-8 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, emergencyFund.target_amount > 0 ? (emergencyFund.current_amount / emergencyFund.target_amount) * 100 : 0)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-body">
              <span className="text-muted-foreground">${emergencyFund.current_amount.toLocaleString()}</span>
              <span className="text-foreground font-semibold">
                {emergencyFund.target_amount > 0 ? `${((emergencyFund.current_amount / emergencyFund.target_amount) * 100).toFixed(0)}%` : "0%"}
              </span>
              <span className="text-muted-foreground">${emergencyFund.target_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Savings Rate */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-5">
        <h3 className="font-display font-bold text-foreground mb-3">Savings Rate Calculator</h3>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <Label className="text-xs font-body text-muted-foreground">Monthly Income</Label>
            <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
            <Input type="number" value={monthlyIncome || ""} onChange={e => setMonthlyIncome(Number(e.target.value))} className="h-9 text-sm pl-6 w-36" /></div>
          </div>
          <div>
            <Label className="text-xs font-body text-muted-foreground">Monthly Savings</Label>
            <p className="text-lg font-display font-bold text-primary">${totalMonthlySavings.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-xs font-body text-muted-foreground">Savings Rate</Label>
            <p className={cn("text-lg font-display font-bold", Number(savingsRate) >= 20 ? "text-green-500" : Number(savingsRate) >= 10 ? "text-primary" : "text-destructive")}>{savingsRate}%</p>
          </div>
        </div>
      </div>

      {/* Sinking Funds */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-foreground">Savings Funds</h3>
        {funds.map((fund, i) => {
          const pct = fund.target_amount > 0 ? (fund.current_amount / fund.target_amount) * 100 : 0;
          const monthsLeft = fund.monthly_contribution > 0 ? Math.ceil((fund.target_amount - fund.current_amount) / fund.monthly_contribution) : 0;
          return (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-semibold text-muted-foreground uppercase">Fund {i + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeFund(i)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div><Label className="text-xs font-body text-muted-foreground">Name</Label>
                  <Input value={fund.fund_name} onChange={e => updateFund(i, "fund_name", e.target.value)} className="h-9 text-sm" /></div>
                <div><Label className="text-xs font-body text-muted-foreground">Target</Label>
                  <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input type="number" value={fund.target_amount || ""} onChange={e => updateFund(i, "target_amount", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                <div><Label className="text-xs font-body text-muted-foreground">Current</Label>
                  <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input type="number" value={fund.current_amount || ""} onChange={e => updateFund(i, "current_amount", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                <div><Label className="text-xs font-body text-muted-foreground">Monthly</Label>
                  <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input type="number" value={fund.monthly_contribution || ""} onChange={e => updateFund(i, "monthly_contribution", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
                <div className="flex items-end gap-2">
                  <div><Checkbox checked={fund.is_emergency_fund} onCheckedChange={c => updateFund(i, "is_emergency_fund", !!c)} />
                  <Label className="text-xs ml-1">Emergency Fund</Label></div>
                </div>
              </div>
              {fund.target_amount > 0 && (
                <div>
                  <Progress value={Math.min(100, pct)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{pct.toFixed(0)}% complete</span>
                    {monthsLeft > 0 && <span>~{monthsLeft} months to go</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={addFund} className="gap-2"><Plus className="h-4 w-4" /> Add Fund</Button>
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Savings
        </Button>
      </div>
    </div>
  );
}
