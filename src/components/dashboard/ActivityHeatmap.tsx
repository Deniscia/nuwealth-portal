import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function ActivityHeatmap() {
  const { user } = useAuth();
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const fetchActivity = async () => {
      const thirteenWeeksAgo = new Date();
      thirteenWeeksAgo.setDate(thirteenWeeksAgo.getDate() - 91);
      const { data } = await supabase
        .from("activity_log")
        .select("activity_date")
        .eq("user_id", user.id)
        .gte("activity_date", thirteenWeeksAgo.toISOString().split("T")[0]);
      setActivityDates(new Set(data?.map((d) => d.activity_date) || []));
    };
    fetchActivity();
  }, [user]);

  // Generate 13 weeks of dates
  const weeks: string[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);
  // Align to Monday
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  let currentDate = new Date(startDate);
  let currentWeek: string[] = [];
  while (currentDate <= today) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (currentWeek.length) weeks.push(currentWeek);

  const dayLabels = ["M", "", "W", "", "F", "", ""];

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
      <h3 className="text-sm font-display font-semibold text-foreground mb-3">Weekly Activity</h3>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 w-3 flex items-center justify-center">
              <span className="text-[8px] text-muted-foreground font-body">{label}</span>
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((date) => {
              const isActive = activityDates.has(date);
              const isFuture = new Date(date) > today;
              return (
                <div
                  key={date}
                  className={cn(
                    "h-3 w-3 rounded-sm transition-colors",
                    isFuture
                      ? "bg-transparent"
                      : isActive
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                  title={`${date}${isActive ? " — Active" : ""}`}
                />
              );
            })}
            {/* Pad short weeks */}
            {Array.from({ length: 7 - week.length }).map((_, i) => (
              <div key={`pad-${i}`} className="h-3 w-3" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
