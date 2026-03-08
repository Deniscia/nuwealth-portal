import { PHASES } from "@/data/workbooks";
import { cn } from "@/lib/utils";

interface Props {
  phaseProgress: Record<number, { completed: number; total: number }>;
  currentPhase: number;
}

export function PhaseRings({ phaseProgress, currentPhase }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {PHASES.map((phase) => {
        const prog = phaseProgress[phase.number];
        const pct = prog ? (prog.completed / prog.total) * 100 : 0;
        const isCurrent = phase.number === currentPhase;
        const circumference = 2 * Math.PI * 18;
        const offset = circumference - (pct / 100) * circumference;

        return (
          <div key={phase.number} className="flex flex-col items-center gap-1">
            <div className={cn(
              "relative w-12 h-12 rounded-full flex items-center justify-center",
              isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}>
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r="18" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-xs font-display font-bold text-foreground">
                {phase.number}
              </span>
            </div>
            <span className="text-[10px] font-body text-muted-foreground text-center max-w-[56px] leading-tight">
              {phase.title.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
