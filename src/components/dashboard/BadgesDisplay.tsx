import { BADGE_DEFINITIONS } from "@/hooks/useBadges";
import { Star, BookOpen, BarChart3, Shield, Award, CircleDot, Crown, GraduationCap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  star: Star,
  "book-open": BookOpen,
  "bar-chart-3": BarChart3,
  shield: Shield,
  award: Award,
  "circle-dot": CircleDot,
  crown: Crown,
  "graduation-cap": GraduationCap,
};

interface Props {
  earnedBadges: Set<string>;
}

export function BadgesDisplay({ earnedBadges }: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Badges</h3>
      <div className="grid grid-cols-4 gap-3">
        {BADGE_DEFINITIONS.map((badge) => {
          const earned = earnedBadges.has(badge.key);
          const Icon = ICON_MAP[badge.icon] || Star;
          return (
            <div key={badge.key} className="flex flex-col items-center gap-1.5" title={badge.description}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                earned
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground/40"
              )}>
                {earned ? <Icon className="h-5 w-5" /> : <Lock className="h-3.5 w-3.5" />}
              </div>
              <span className={cn(
                "text-[10px] font-body text-center leading-tight max-w-[60px]",
                earned ? "text-foreground" : "text-muted-foreground/50"
              )}>
                {badge.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
