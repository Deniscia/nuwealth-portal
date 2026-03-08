import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Debt {
  id?: string;
  creditor: string;
  balance: number;
  interest_rate: number;
  min_payment: number;
  payoff_order: number;
  total_paid: number;
}

export function DebtTracker() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("tracker_debts").select("*").eq("user_id", user.id).order("payoff_order").then(({ data }) => {
      if (data && data.length > 0) setDebts(data.map(d => ({ ...d, balance: Number(d.balance), interest_rate: Number(d.interest_rate), min_payment: Number(d.min_payment), total_paid: Number(d.total_paid) })));
      setLoading(false);
    });
  }, [user]);

  // Try auto-populate from workbook responses
  useEffect(() => {
    if (!user || debts.length > 0 || loading) return;
    supabase.from("workbook_responses").select("responses").eq("user_id", user.id).eq("workbook_id", "p4-debt-assessment").maybeSingle().then(({ data }) => {
      if (data?.responses) {
        const r = data.responses as Record<string, any>;
        if (Array.isArray(r["debt-entries"])) {
          const imported = r["debt-entries"].map((e: any, i: number) => ({
            creditor: e.creditor || "",
            balance: Number(e.balance) || 0,
            interest_rate: Number(e["interest-rate"]) || 0,
            min_payment: Number(e["min-payment"]) || 0,
            payoff_order: i + 1,
            total_paid: 0,
          })).filter((d: Debt) => d.creditor);
          if (imported.length > 0) {
            setDebts(imported);
            toast.info("Imported debt data from your workbook!");
          }
        }
      }
    });
  }, [user, loading, debts.length]);

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalPaid = debts.reduce((s, d) => s + d.total_paid, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.min_payment, 0);

  // Snowball sort (smallest balance first)
  const snowball = [...debts].sort((a, b) => a.balance - b.balance);
  // Avalanche sort (highest interest first)
  const avalanche = [...debts].sort((a, b) => b.interest_rate - a.interest_rate);

  // Simple payoff estimate (months)
  const estimateMonths = (sorted: Debt[]) => {
    if (totalMinPayment === 0) return 0;
    let remaining = sorted.map(d => d.balance);
    let months = 0;
    while (remaining.some(b => b > 0) && months < 600) {
      months++;
      for (let i = 0; i < remaining.length; i++) {
        if (remaining[i] > 0) {
          remaining[i] = Math.max(0, remaining[i] * (1 + sorted[i].interest_rate / 100 / 12) - sorted[i].min_payment);
        }
      }
    }
    return months;
  };

  const snowballMonths = estimateMonths(snowball);
  const avalancheMonths = estimateMonths(avalanche);

  const addDebt = () => setDebts(p => [...p, { creditor: "", balance: 0, interest_rate: 0, min_payment: 0, payoff_order: p.length + 1, total_paid: 0 }]);
  const removeDebt = (i: number) => setDebts(p => p.filter((_, idx) => idx !== i));
  const updateDebt = (i: number, field: keyof Debt, val: any) => setDebts(p => p.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // Delete existing and re-insert
    await supabase.from("tracker_debts").delete().eq("user_id", user.id);
    if (debts.length > 0) {
      const { error } = await supabase.from("tracker_debts").insert(debts.map(d => ({ ...d, user_id: user.id, id: undefined })));
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
    }
    toast.success("Debts updated!");
    // Check milestones
    if (totalPaid >= 1000 || totalPaid >= 5000 || totalPaid >= 10000) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setSaving(false);
  };

  // Payoff timeline chart data
  const chartData = debts.filter(d => d.creditor).map(d => ({
    name: d.creditor.slice(0, 12),
    balance: d.balance,
    paid: d.total_paid,
  }));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {showConfetti && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <PartyPopper className="h-6 w-6 text-primary" />
          <p className="font-body font-semibold text-foreground">🎉 Milestone! You've paid off ${totalPaid.toLocaleString()} in debt!</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Total Debt</p>
          <p className="text-xl font-display font-bold text-destructive">${totalDebt.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Paid Off</p>
          <p className="text-xl font-display font-bold text-primary">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Snowball</p>
          <p className="text-xl font-display font-bold text-foreground">{snowballMonths} mo</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Avalanche</p>
          <p className="text-xl font-display font-bold text-foreground">{avalancheMonths} mo</p>
        </div>
      </div>

      {/* Countdown */}
      {totalDebt > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-sm font-body text-foreground">
            You are projected to be debt-free in <strong className="text-primary">{Math.min(snowballMonths, avalancheMonths)} months</strong> 🎯
          </p>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Payoff Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="balance" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} name="Remaining" />
              <Bar dataKey="paid" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Paid Off" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Debt Entries */}
      <div className="space-y-3">
        {debts.map((debt, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase">Debt {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => removeDebt(i)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><Label className="text-xs font-body text-muted-foreground">Creditor</Label>
                <Input value={debt.creditor} onChange={e => updateDebt(i, "creditor", e.target.value)} className="h-9 text-sm" /></div>
              <div><Label className="text-xs font-body text-muted-foreground">Balance</Label>
                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input type="number" value={debt.balance || ""} onChange={e => updateDebt(i, "balance", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
              <div><Label className="text-xs font-body text-muted-foreground">Interest Rate %</Label>
                <Input type="number" step="0.1" value={debt.interest_rate || ""} onChange={e => updateDebt(i, "interest_rate", Number(e.target.value))} className="h-9 text-sm" /></div>
              <div><Label className="text-xs font-body text-muted-foreground">Min Payment</Label>
                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input type="number" value={debt.min_payment || ""} onChange={e => updateDebt(i, "min_payment", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
              <div><Label className="text-xs font-body text-muted-foreground">Total Paid</Label>
                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input type="number" value={debt.total_paid || ""} onChange={e => updateDebt(i, "total_paid", Number(e.target.value))} className="h-9 text-sm pl-6" /></div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={addDebt} className="gap-2"><Plus className="h-4 w-4" /> Add Debt</Button>
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Debts
        </Button>
      </div>
    </div>
  );
}
