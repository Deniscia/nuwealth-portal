import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PHASES } from "@/data/workbooks";
import { BADGE_DEFINITIONS } from "@/hooks/useBadges";
import { Loader2, Users, TrendingUp, Award, BarChart3 } from "lucide-react";

interface Analytics {
  totalMembers: number;
  avgProgress: number;
  avgStreak: number;
  activeToday: number;
  activeThisWeek: number;
  workbookCompletionCounts: Record<string, number>;
  escalationCounts: Record<string, number>;
  badgeDistribution: Record<string, number>;
  trackerAdoption: { budget: number; debts: number; savings: number; goals: number };
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split("T")[0];

    const [profilesRes, completionsRes, escalationsRes, badgesRes, activityTodayRes, activityWeekRes, budgetRes, debtsRes, savingsRes, goalsRes] = await Promise.all([
      supabase.from("profiles").select("overall_progress, streak_days, user_id"),
      supabase.from("workbook_completions").select("workbook_id"),
      supabase.from("escalations").select("workbook_name"),
      supabase.from("user_badges").select("badge_key"),
      supabase.from("activity_log").select("user_id").eq("activity_date", today),
      supabase.from("activity_log").select("user_id").gte("activity_date", weekAgoStr),
      supabase.from("tracker_budget").select("user_id"),
      supabase.from("tracker_debts").select("user_id"),
      supabase.from("tracker_savings").select("user_id"),
      supabase.from("tracker_goals").select("user_id"),
    ]);

    const profiles = profilesRes.data || [];
    const totalMembers = profiles.length || 1;
    const avgProgress = Math.round(profiles.reduce((s, p) => s + p.overall_progress, 0) / totalMembers);
    const avgStreak = Math.round(profiles.reduce((s, p) => s + p.streak_days, 0) / totalMembers);

    const activeToday = new Set(activityTodayRes.data?.map((a) => a.user_id) || []).size;
    const activeThisWeek = new Set(activityWeekRes.data?.map((a) => a.user_id) || []).size;

    const workbookCompletionCounts: Record<string, number> = {};
    completionsRes.data?.forEach((c) => {
      workbookCompletionCounts[c.workbook_id] = (workbookCompletionCounts[c.workbook_id] || 0) + 1;
    });

    const escalationCounts: Record<string, number> = {};
    escalationsRes.data?.forEach((e) => {
      escalationCounts[e.workbook_name] = (escalationCounts[e.workbook_name] || 0) + 1;
    });

    const badgeDistribution: Record<string, number> = {};
    badgesRes.data?.forEach((b) => {
      badgeDistribution[b.badge_key] = (badgeDistribution[b.badge_key] || 0) + 1;
    });

    const trackerAdoption = {
      budget: new Set(budgetRes.data?.map((b) => b.user_id) || []).size,
      debts: new Set(debtsRes.data?.map((d) => d.user_id) || []).size,
      savings: new Set(savingsRes.data?.map((s) => s.user_id) || []).size,
      goals: new Set(goalsRes.data?.map((g) => g.user_id) || []).size,
    };

    setAnalytics({ totalMembers, avgProgress, avgStreak, activeToday, activeThisWeek, workbookCompletionCounts, escalationCounts, badgeDistribution, trackerAdoption });
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!analytics) return null;

  const allWorkbooks = PHASES.flatMap((p) => p.workbooks);
  const topCompleted = allWorkbooks
    .map((w) => ({ title: w.title, count: analytics.workbookCompletionCounts[w.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topEscalated = Object.entries(analytics.escalationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Members" value={analytics.totalMembers} />
        <StatCard icon={TrendingUp} label="Avg Progress" value={`${analytics.avgProgress}%`} />
        <StatCard icon={Award} label="Avg Streak" value={`${analytics.avgStreak}d`} />
        <StatCard icon={Users} label="Active Today" value={analytics.activeToday} />
      </div>

      {/* Engagement */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Engagement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-body">Active this week</p>
            <p className="text-2xl font-display font-bold">{analytics.activeThisWeek}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-body">Weekly active rate</p>
            <p className="text-2xl font-display font-bold">{Math.round((analytics.activeThisWeek / analytics.totalMembers) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Most Completed + Most Escalated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-card p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Most Completed Workbooks</h3>
          <div className="space-y-2">
            {topCompleted.map((w) => (
              <div key={w.title} className="flex items-center justify-between">
                <span className="text-xs font-body text-foreground truncate flex-1">{w.title}</span>
                <span className="text-xs font-display font-bold text-primary ml-2">{w.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Most Escalated Questions</h3>
          <div className="space-y-2">
            {topEscalated.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body">No escalations yet</p>
            ) : topEscalated.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-xs font-body text-foreground truncate flex-1">{name}</span>
                <span className="text-xs font-display font-bold text-primary ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Distribution */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">Badge Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map((badge) => (
            <div key={badge.key} className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-display font-bold text-foreground">{analytics.badgeDistribution[badge.key] || 0}</p>
              <p className="text-[10px] font-body text-muted-foreground">{badge.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracker Adoption */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3">Tracker Adoption</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(analytics.trackerAdoption).map(([key, count]) => (
            <div key={key} className="bg-muted rounded-xl p-3 text-center">
              <p className="text-lg font-display font-bold text-foreground">{Math.round((count / analytics.totalMembers) * 100)}%</p>
              <p className="text-[10px] font-body text-muted-foreground capitalize">{key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-body text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    </div>
  );
}
