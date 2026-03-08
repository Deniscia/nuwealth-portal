import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id?: string;
  category: string;
  item_name: string;
  amount: number;
}

const CATEGORIES = [
  { key: "income", label: "Income", color: "text-green-500" },
  { key: "fixed", label: "Fixed Expenses", color: "text-foreground" },
  { key: "variable", label: "Variable Necessities", color: "text-foreground" },
  { key: "goals", label: "Financial Goals", color: "text-primary" },
  { key: "discretionary", label: "Discretionary", color: "text-muted-foreground" },
];

export function BudgetBuilder() {
  const { user } = useAuth();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("tracker_budget").select("*").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data && data.length > 0) setItems(data.map(d => ({ ...d, amount: Number(d.amount) })));
      setLoading(false);
    });
  }, [user]);

  // Auto-populate from workbook
  useEffect(() => {
    if (!user || items.length > 0 || loading) return;
    supabase.from("workbook_responses").select("responses").eq("user_id", user.id).eq("workbook_id", "p3-budget-creation").maybeSingle().then(({ data }) => {
      if (data?.responses) {
        const r = data.responses as Record<string, any>;
        const imported: BudgetItem[] = [];
        if (r["primary-income"]) imported.push({ category: "income", item_name: "Primary Income", amount: Number(r["primary-income"]) || 0 });
        if (r["secondary-income"]) imported.push({ category: "income", item_name: "Secondary Income", amount: Number(r["secondary-income"]) || 0 });
        if (r["other-income"]) imported.push({ category: "income", item_name: "Other Income", amount: Number(r["other-income"]) || 0 });
        if (Array.isArray(r["expense-entries"])) {
          r["expense-entries"].forEach((e: any) => {
            const cat = e.necessity === "Need" ? "fixed" : "discretionary";
            if (e.category) imported.push({ category: cat, item_name: e.category, amount: Number(e.amount) || 0 });
          });
        }
        if (imported.length > 0) {
          setItems(imported);
          toast.info("Imported budget data from your workbook!");
        }
      }
    });
  }, [user, loading, items.length]);

  const getByCategory = (cat: string) => items.filter(i => i.category === cat);
  const totalIncome = getByCategory("income").reduce((s, i) => s + i.amount, 0);
  const totalExpenses = items.filter(i => i.category !== "income").reduce((s, i) => s + i.amount, 0);
  const remaining = totalIncome - totalExpenses;

  // 50/30/20 targets
  const needs = getByCategory("fixed").reduce((s, i) => s + i.amount, 0) + getByCategory("variable").reduce((s, i) => s + i.amount, 0);
  const wants = getByCategory("discretionary").reduce((s, i) => s + i.amount, 0);
  const savings = getByCategory("goals").reduce((s, i) => s + i.amount, 0);

  const needsPct = totalIncome > 0 ? (needs / totalIncome * 100).toFixed(0) : "0";
  const wantsPct = totalIncome > 0 ? (wants / totalIncome * 100).toFixed(0) : "0";
  const savingsPct = totalIncome > 0 ? (savings / totalIncome * 100).toFixed(0) : "0";

  const addItem = (cat: string) => setItems(p => [...p, { category: cat, item_name: "", amount: 0 }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof BudgetItem, val: any) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("tracker_budget").delete().eq("user_id", user.id);
    if (items.length > 0) {
      const { error } = await supabase.from("tracker_budget").insert(items.map(i => ({ ...i, user_id: user.id, id: undefined })));
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
    }
    toast.success("Budget saved!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Income</p>
            <p className="text-xl font-display font-bold text-green-500">${totalIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Expenses</p>
            <p className="text-xl font-display font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Remaining</p>
            <p className={cn("text-xl font-display font-bold", remaining >= 0 ? "text-green-500" : remaining > -100 ? "text-primary" : "text-destructive")}>
              ${Math.abs(remaining).toLocaleString()}{remaining < 0 ? " over" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* 50/30/20 Overlay */}
      {totalIncome > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-3">
          <h3 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider">50/30/20 Comparison</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Needs", actual: needsPct, target: "50", pct: Number(needsPct) },
              { label: "Wants", actual: wantsPct, target: "30", pct: Number(wantsPct) },
              { label: "Savings", actual: savingsPct, target: "20", pct: Number(savingsPct) },
            ].map(item => (
              <div key={item.label} className="text-center space-y-1">
                <p className="text-xs font-body text-muted-foreground">{item.label}</p>
                <p className={cn("text-lg font-display font-bold",
                  item.label === "Needs" ? (item.pct <= 50 ? "text-green-500" : item.pct <= 60 ? "text-primary" : "text-destructive") :
                  item.label === "Wants" ? (item.pct <= 30 ? "text-green-500" : item.pct <= 40 ? "text-primary" : "text-destructive") :
                  (item.pct >= 20 ? "text-green-500" : item.pct >= 10 ? "text-primary" : "text-destructive")
                )}>{item.actual}%</p>
                <p className="text-xs text-muted-foreground">Target: {item.target}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Sections */}
      {CATEGORIES.map(cat => {
        const catItems = items.map((item, globalIdx) => ({ ...item, globalIdx })).filter(i => i.category === cat.key);
        const catTotal = catItems.reduce((s, i) => s + i.amount, 0);
        return (
          <div key={cat.key} className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={cn("font-display font-bold", cat.color)}>{cat.label}</h3>
              <span className="text-sm font-display font-semibold text-muted-foreground">${catTotal.toLocaleString()}</span>
            </div>
            {catItems.map(item => (
              <div key={item.globalIdx} className="flex items-center gap-2">
                <Input value={item.item_name} onChange={e => updateItem(item.globalIdx, "item_name", e.target.value)} placeholder="Item name" className="h-9 text-sm flex-1" />
                <div className="relative w-28">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                  <Input type="number" value={item.amount || ""} onChange={e => updateItem(item.globalIdx, "amount", Number(e.target.value))} className="h-9 text-sm pl-6" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.globalIdx)} className="h-8 w-8 flex-shrink-0">
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addItem(cat.key)} className="text-xs gap-1">
              <Plus className="h-3 w-3" /> Add {cat.label === "Income" ? "Source" : "Item"}
            </Button>
          </div>
        );
      })}

      <div className="flex justify-center">
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Budget
        </Button>
      </div>
    </div>
  );
}
