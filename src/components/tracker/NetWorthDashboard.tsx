import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DEFAULT_ASSETS = { savings: 0, investments: 0, home_value: 0, car_value: 0, other: 0 };
const DEFAULT_LIABILITIES = { mortgage: 0, car_loan: 0, student_loans: 0, credit_cards: 0, other: 0 };

export function NetWorthDashboard() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Record<string, number>>({ ...DEFAULT_ASSETS });
  const [liabilities, setLiabilities] = useState<Record<string, number>>({ ...DEFAULT_LIABILITIES });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const totalAssets = Object.values(assets).reduce((s, v) => s + (Number(v) || 0), 0);
  const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + (Number(v) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: hist } = await supabase
        .from("tracker_net_worth")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: true });

      if (hist && hist.length > 0) {
        const latest = hist[hist.length - 1];
        setAssets({ ...DEFAULT_ASSETS, ...(latest.assets as Record<string, number>) });
        setLiabilities({ ...DEFAULT_LIABILITIES, ...(latest.liabilities as Record<string, number>) });
        setLastUpdate(latest.recorded_at);
        setHistory(hist.map(h => ({
          date: new Date(h.recorded_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          netWorth: Number(h.net_worth),
        })));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("tracker_net_worth").upsert({
      user_id: user.id,
      assets,
      liabilities,
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
      net_worth: netWorth,
      recorded_at: today,
    }, { onConflict: "user_id,recorded_at" });
    if (!error) {
      toast.success("Net worth updated!");
      setLastUpdate(today);
    } else {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  const needsUpdate = lastUpdate && (Date.now() - new Date(lastUpdate).getTime()) > 30 * 24 * 60 * 60 * 1000;

  // Gauge calculation: map netWorth to 0-180 degrees
  const gaugeAngle = Math.min(180, Math.max(0, ((netWorth + 50000) / 200000) * 180));
  const gaugeColor = netWorth < 0 ? "hsl(0, 70%, 50%)" : netWorth < 10000 ? "hsl(var(--primary))" : "hsl(142, 70%, 45%)";

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {needsUpdate && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-sm font-body text-foreground">
          ⏰ It's been over 30 days since your last update. Time to refresh your numbers!
        </div>
      )}

      {/* Net Worth Display */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center space-y-4">
        <p className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider">Your Net Worth</p>
        {/* SVG Gauge */}
        <div className="relative mx-auto w-48 h-28">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={gaugeColor} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${(gaugeAngle / 180) * 251.2} 251.2`} />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className={cn("text-3xl font-display font-bold", netWorth >= 0 ? "text-foreground" : "text-destructive")}>
              ${Math.abs(netWorth).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-8 text-sm font-body">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Assets:</span>
            <span className="font-semibold text-foreground">${totalAssets.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground">Debts:</span>
            <span className="font-semibold text-foreground">${totalLiabilities.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* History Chart */}
      {history.length > 1 && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Net Worth History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Net Worth']} />
              <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
          <h3 className="font-display font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" /> Assets
          </h3>
          {Object.entries(assets).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <Label className="text-sm font-body text-muted-foreground capitalize w-28">{key.replace(/_/g, ' ')}</Label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" value={val || ""} onChange={e => setAssets(p => ({ ...p, [key]: Number(e.target.value) || 0 }))}
                  className="pl-7 h-9 text-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
          <h3 className="font-display font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" /> Liabilities
          </h3>
          {Object.entries(liabilities).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <Label className="text-sm font-body text-muted-foreground capitalize w-28">{key.replace(/_/g, ' ')}</Label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" value={val || ""} onChange={e => setLiabilities(p => ({ ...p, [key]: Number(e.target.value) || 0 }))}
                  className="pl-7 h-9 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Net Worth Snapshot
        </Button>
      </div>
    </div>
  );
}
