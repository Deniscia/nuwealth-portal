import { useAuth } from "@/hooks/useAuth";
import { Flame, Target, TrendingUp, Sparkles } from "lucide-react";

const PHASE_NAMES = [
  "Foundation",
  "Budgeting Mastery",
  "Debt Freedom",
  "Investing Basics",
  "Wealth Building",
  "Legacy Planning",
  "Financial Freedom",
];

const Dashboard = () => {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "Queen";
  const progress = profile?.overall_progress ?? 0;
  const currentPhase = profile?.current_phase ?? 1;
  const streak = profile?.streak_days ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Welcome back, {firstName} ✨
        </h1>
        <p className="mt-1 text-muted-foreground font-body">
          Your financial transformation journey continues.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="bg-card rounded-2xl shadow-card p-6 border border-border col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-body font-medium text-muted-foreground">Overall Progress</span>
          </div>
          <p className="text-4xl font-display font-bold text-foreground">{progress}%</p>
          <div className="mt-3 h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-body font-medium text-muted-foreground">Current Phase</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">Phase {currentPhase}</p>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {PHASE_NAMES[currentPhase - 1]}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-sm font-body font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-4xl font-display font-bold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground font-body mt-1">days active</p>
        </div>
      </div>

      {/* Motivational Card */}
      <div className="bg-navy rounded-2xl p-6 md:p-8 text-navy-foreground">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-lg font-semibold">Today's Affirmation</h3>
            <p className="mt-2 text-navy-foreground/80 font-body leading-relaxed">
              "I am worthy of financial abundance. Every step I take builds the legacy I deserve."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
