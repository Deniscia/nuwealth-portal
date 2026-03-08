import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetWorthDashboard } from "@/components/tracker/NetWorthDashboard";
import { DebtTracker } from "@/components/tracker/DebtTracker";
import { SavingsTracker } from "@/components/tracker/SavingsTracker";
import { BudgetBuilder } from "@/components/tracker/BudgetBuilder";
import { FinancialCalculators } from "@/components/tracker/FinancialCalculators";
import { GoalTracker } from "@/components/tracker/GoalTracker";
import { InvestmentTracker } from "@/components/tracker/InvestmentTracker";
import { BarChart3, CreditCard, PiggyBank, Wallet, Calculator, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "net-worth", label: "Net Worth", icon: BarChart3 },
  { key: "debt", label: "Debt", icon: CreditCard },
  { key: "savings", label: "Savings", icon: PiggyBank },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "calculators", label: "Calculators", icon: Calculator },
  { key: "goals", label: "Goals", icon: Target },
  { key: "investments", label: "Investments", icon: TrendingUp },
];

const Tracker = () => {
  const [activeTab, setActiveTab] = useState("net-worth");

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Tracker</h1>
        <p className="mt-1 text-muted-foreground font-body">
          Your complete financial command center.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Scrollable tab bar */}
        <div className="overflow-x-auto -mx-4 px-4 pb-1">
          <TabsList className="inline-flex h-auto bg-card border border-border rounded-2xl p-1 gap-0.5 min-w-max">
            {TABS.map(tab => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-gold",
                  "data-[state=inactive]:text-muted-foreground"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="net-worth" className="mt-4"><NetWorthDashboard /></TabsContent>
        <TabsContent value="debt" className="mt-4"><DebtTracker /></TabsContent>
        <TabsContent value="savings" className="mt-4"><SavingsTracker /></TabsContent>
        <TabsContent value="budget" className="mt-4"><BudgetBuilder /></TabsContent>
        <TabsContent value="calculators" className="mt-4"><FinancialCalculators /></TabsContent>
        <TabsContent value="goals" className="mt-4"><GoalTracker /></TabsContent>
        <TabsContent value="investments" className="mt-4"><InvestmentTracker /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Tracker;
