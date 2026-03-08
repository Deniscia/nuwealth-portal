import { useEffect, useState } from "react";
import { BadgeDef } from "@/hooks/useBadges";
import { Star, BookOpen, BarChart3, Shield, Award, CircleDot, Crown, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  badge: BadgeDef;
  onDismiss: () => void;
}

export function BadgeCelebration({ badge, onDismiss }: Props) {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; color: string }[]>([]);
  const Icon = ICON_MAP[badge.icon] || Star;

  useEffect(() => {
    const colors = [
      "hsl(38, 63%, 44%)",
      "hsl(38, 50%, 60%)",
      "hsl(40, 20%, 96%)",
      "hsl(38, 63%, 44%)",
      "hsl(0, 0%, 17%)",
    ];
    const p = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[i % colors.length],
    }));
    setParticles(p);

    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm animate-fade-in">
      {/* Confetti particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `-5%`,
            backgroundColor: p.color,
            animation: `confetti-fall 2s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}

      <div className="bg-card rounded-3xl shadow-gold p-8 md:p-12 max-w-md mx-4 text-center relative z-10">
        <Button variant="ghost" size="icon" onClick={onDismiss} className="absolute top-4 right-4">
          <X className="h-4 w-4" />
        </Button>

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-10 w-10 text-primary" />
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Badge Unlocked! 🎉
        </h2>
        <h3 className="text-xl font-display font-semibold text-primary mb-3">
          {badge.title}
        </h3>
        <p className="text-muted-foreground font-body">
          {badge.description}
        </p>

        <Button variant="gold" className="mt-6" onClick={onDismiss}>
          Continue My Journey
        </Button>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
