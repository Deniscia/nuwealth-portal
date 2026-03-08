import { LayoutDashboard, ClipboardList, BarChart3, Bot, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Assignments", url: "/assignments", icon: ClipboardList },
  { title: "Tracker", url: "/tracker", icon: BarChart3 },
  { title: "AI Coach", url: "/ai-coach", icon: Bot },
];

export function MobileNav() {
  const location = useLocation();
  const { role } = useAuth();
  const notifCount = useNotificationCount();

  const items = role === "admin"
    ? [...navItems, { title: "Admin", url: "/admin", icon: ShieldCheck }]
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-sidebar-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          const showBadge = item.url === "/admin" && notifCount > 0;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors relative",
                active ? "text-gold" : "text-navy-foreground/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-body font-medium">{item.title}</span>
              {showBadge && (
                <span className="absolute -top-1 right-0 min-w-[16px] h-[16px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5">
                  {notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
