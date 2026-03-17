import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function CalcCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
      <h3 className="font-display font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function CurrencyInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label className="text-xs font-body text-muted-foreground">{label}</Label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
        <Input type="number" value={value || ""} onChange={e => onChange(Number(e.target.value))} className="h-9 text-sm pl-6" />
      </div>
    </div>
  );
}

function NumInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <Label className="text-xs font-body text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input type="number" step="0.1" value={value || ""} onChange={e => onChange(Number(e.target.value))} className="h-9 text-sm" />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-primary/5 rounded-xl p-3 text-center">
      <p className="text-xs font-display font-semibold text-muted-foreground uppercase">{label}</p>
      <p className={cn("text-lg font-display font-bold", color || "text-primary")}>{value}</p>
    </div>
  );
}

export function FinancialCalculators() {
  // Savings Goal
  const [sgTarget, setSgTarget] = useState(0);
  const [sgMonthly, setSgMonthly] = useState(0);
  const sgMonths = sgMonthly > 0 ? Math.ceil(sgTarget / sgMonthly) : 0;
  const sgDate = sgMonths > 0 ? new Date(Date.now() + sgMonths * 30.44 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "--";

  // Emergency Fund
  const [efExpenses, setEfExpenses] = useState(0);
  const [efMonths, setEfMonths] = useState(6);
  const efGoal = efExpenses * efMonths;

  // DTI
  const [dtiDebt, setDtiDebt] = useState(0);
  const [dtiIncome, setDtiIncome] = useState(0);
  const dtiPct = dtiIncome > 0 ? (dtiDebt / dtiIncome * 100) : 0;
  const dtiBenchmark = dtiPct <= 20 ? "Excellent" : dtiPct <= 36 ? "Good" : dtiPct <= 43 ? "Fair" : "High Risk";
  const dtiColor = dtiPct <= 20 ? "text-green-500" : dtiPct <= 36 ? "text-primary" : dtiPct <= 43 ? "text-orange-500" : "text-destructive";

  // Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState(0);
  const [ciRate, setCiRate] = useState(7);
  const [ciYears, setCiYears] = useState(20);
  const [ciMonthly, setCiMonthly] = useState(0);

  const ciData: { year: number; value: number }[] = [];
  let ciBalance = ciPrincipal;
  for (let y = 0; y <= ciYears; y++) {
    ciData.push({ year: y, value: Math.round(ciBalance) });
    ciBalance = ciBalance * (1 + ciRate / 100) + ciMonthly * 12;
  }
  const ciFuture = ciData[ciData.length - 1]?.value || 0;

  // Budget %
  const [bpIncome, setBpIncome] = useState(0);
  const [bpNeeds, setBpNeeds] = useState(0);
  const [bpWants, setBpWants] = useState(0);
  const [bpSavings, setBpSavings] = useState(0);
  const bpNeedsPct = bpIncome > 0 ? (bpNeeds / bpIncome * 100).toFixed(0) : "0";
  const bpWantsPct = bpIncome > 0 ? (bpWants / bpIncome * 100).toFixed(0) : "0";
  const bpSavingsPct = bpIncome > 0 ? (bpSavings / bpIncome * 100).toFixed(0) : "0";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Savings Goal */}
        <CalcCard title="🎯 Savings Goal Calculator">
          <div className="grid grid-cols-2 gap-3">
            <CurrencyInput label="Target Amount" value={sgTarget} onChange={setSgTarget} />
            <CurrencyInput label="Monthly Savings" value={sgMonthly} onChange={setSgMonthly} />
          </div>
          {sgMonths > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <ResultBox label="Months" value={`${sgMonths}`} />
              <ResultBox label="Target Date" value={sgDate} />
            </div>
          )}
        </CalcCard>

        {/* Emergency Fund */}
        <CalcCard title="🛡️ Emergency Fund Calculator">
          <div className="grid grid-cols-2 gap-3">
            <CurrencyInput label="Monthly Expenses" value={efExpenses} onChange={setEfExpenses} />
            <NumInput label="Months of Cover" value={efMonths} onChange={setEfMonths} />
          </div>
          {efGoal > 0 && <ResultBox label="Your Emergency Fund Goal" value={`$${efGoal.toLocaleString()}`} />}
        </CalcCard>

        {/* DTI */}
        <CalcCard title="📊 Debt-to-Income Calculator">
          <div className="grid grid-cols-2 gap-3">
            <CurrencyInput label="Monthly Debt Payments" value={dtiDebt} onChange={setDtiDebt} />
            <CurrencyInput label="Gross Monthly Income" value={dtiIncome} onChange={setDtiIncome} />
          </div>
          {dtiIncome > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <ResultBox label="DTI Ratio" value={`${dtiPct.toFixed(1)}%`} color={dtiColor} />
              <ResultBox label="Rating" value={dtiBenchmark} color={dtiColor} />
            </div>
          )}
        </CalcCard>
      </div>

      {/* Compound Interest - full width */}
      <CalcCard title="📈 Compound Interest Calculator">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CurrencyInput label="Starting Amount" value={ciPrincipal} onChange={setCiPrincipal} />
          <NumInput label="Annual Return" value={ciRate} onChange={setCiRate} suffix="%" />
          <NumInput label="Years" value={ciYears} onChange={setCiYears} />
          <CurrencyInput label="Monthly Contribution" value={ciMonthly} onChange={setCiMonthly} />
        </div>
        <ResultBox label="Future Value" value={`$${ciFuture.toLocaleString()}`} />
        {ciData.length > 1 && (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ciData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CalcCard>

      {/* Budget % */}
      <CalcCard title="💰 Budget Percentage Calculator">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CurrencyInput label="Monthly Income" value={bpIncome} onChange={setBpIncome} />
          <CurrencyInput label="Needs" value={bpNeeds} onChange={setBpNeeds} />
          <CurrencyInput label="Wants" value={bpWants} onChange={setBpWants} />
          <CurrencyInput label="Savings/Debt" value={bpSavings} onChange={setBpSavings} />
        </div>
        {bpIncome > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <ResultBox label={`Needs (${bpNeedsPct}%)`} value="Target: 50%" color={Number(bpNeedsPct) <= 50 ? "text-green-500" : "text-destructive"} />
            <ResultBox label={`Wants (${bpWantsPct}%)`} value="Target: 30%" color={Number(bpWantsPct) <= 30 ? "text-green-500" : "text-destructive"} />
            <ResultBox label={`Save (${bpSavingsPct}%)`} value="Target: 20%" color={Number(bpSavingsPct) >= 20 ? "text-green-500" : "text-destructive"} />
          </div>
        )}
      </CalcCard>
    </div>
  );
}
