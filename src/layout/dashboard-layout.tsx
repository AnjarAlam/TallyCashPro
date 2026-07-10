"use client";

import { DashboardSidebar } from "@/components/sidebarComps";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { type ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider style={{ '--sidebar-width': '230px' } as React.CSSProperties}>
      <DashboardSidebar />
      <SidebarInset className="min-w-0 overflow-x-hidden relative bg-slate-50/50 dark:bg-slate-950/20">
        {/* Mobile top navigation header (hidden on desktop) */}
        <div className="md:hidden px-4 py-2 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-14 shrink-0">
          <SidebarTrigger className="text-slate-700 dark:text-slate-300" />
          <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">Tally Cash Pro</span>
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <NotificationBell />
          </div>
        </div>

        <section className="flex-1 min-w-0 overflow-x-hidden">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
