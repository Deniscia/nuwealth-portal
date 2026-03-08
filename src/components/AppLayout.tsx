import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="hidden md:flex text-muted-foreground hover:text-foreground" />
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center">
                <span className="text-xs font-display font-bold text-gold">N</span>
              </div>
              <span className="text-sm font-display font-semibold text-foreground">NuWealth</span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
