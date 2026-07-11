"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  Home,
  Book,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Plus,
  Building2,
  LogOut,
  Activity,
  BarChart,
  User,
  HelpCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sidebarNavConfig } from "@/config";
import { useBusiness, useAuth } from "@/hooks";
import { useGetCompanyList } from "@/services";
import { useGetCashbookList } from "@/services/cashbook.service";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { NotificationBell } from "@/components/notifications/notification-bell";

// Helper component to render business list items with dynamic books count
function BusinessDropdownItem({
  businessItem,
  isSelected,
  onClick,
}: {
  businessItem: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { cashbookList, isCashbookListPending } = useGetCashbookList(
    businessItem.company._id
  );

  const getInitials = (nameString?: string) => {
    if (!nameString) return "";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <DropdownMenuItem
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected
        ? 'bg-slate-50 font-semibold'
        : 'hover:bg-slate-50'
        }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-[#3b82f6] text-white font-bold shrink-0 text-[13px] uppercase">
          {getInitials(businessItem.company.name) || "B"}
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className="font-bold text-[13px] text-slate-800 truncate block leading-tight">
            {businessItem.company.name}
          </span>
          <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">
            {isCashbookListPending ? "Loading..." : `${cashbookList?.length || 0} Books`}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 text-slate-400 shrink-0 stroke-[2.5]" />
    </DropdownMenuItem>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const business = useBusiness();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [businessSearchQuery, setBusinessSearchQuery] = useState("");
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { companyList: businesses, isCompanyListPending } = useGetCompanyList();

  // Fetch cashbooks for active business to display correct book count
  const { cashbookList, isCashbookListPending } = useGetCashbookList(
    business.businessInfo.id || ""
  );

  // Close sidebar on pathname change
  useEffect(() => {
    const closeSidebar = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        const closeButton = document.querySelector(
          '[data-sidebar="trigger"]'
        ) as HTMLElement | null;

        const sidebar = document.querySelector(
          '[data-sidebar="sidebar"]'
        ) as HTMLElement | null;

        if (sidebar && sidebar.classList.contains("sidebar-open")) {
          closeButton?.click();
        }
      }
    };

    closeSidebar();
  }, [pathname]);

  const handleBusinessChange = (selectedBusiness: any) => {
    business.updateBusinessInfo({
      id: selectedBusiness._id,
      name: selectedBusiness.name,
      category: selectedBusiness.category,
      description: selectedBusiness.description,
    });
    localStorage.setItem("currentBusiness", JSON.stringify({
      id: selectedBusiness._id,
      name: selectedBusiness.name,
      category: selectedBusiness.category,
      description: selectedBusiness.description,
    }));

    // Redirect to the equivalent subpage for the newly selected business only if we are on a business-specific route
    if (pathname.startsWith('/dashboard/business/')) {
      const segments = pathname.split('/');
      if (segments.length > 3) {
        segments[3] = selectedBusiness._id;
        router.push(segments.join('/'));
      }
    }
  };

  const newConfig = [...sidebarNavConfig,
  {
    title: "Books",
    url: `/dashboard/business/${business.businessInfo.id}/book`,
    icon: Book,
  },
  {
    title: "Team Management",
    url: `/dashboard/team-management`,
    icon: Users,
  },
  {
    title: "Reports",
    url: `/dashboard/report`,
    icon: BarChart,
  },
  {
    title: "Activity Logs",
    url: `/dashboard/business/${business.businessInfo.id}/activity`,
    icon: Activity,
  },
  {
    title: "Help & FAQ",
    url: `/dashboard/help`,
    icon: HelpCircle,
  },
  ];

  const settingsItems = [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Back to Landing",
      url: "/",
      icon: Home,
    },
  ];

  // Direct click handler for mobile
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const trigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
      if (trigger) {
        trigger.click();
      }

      const openSidebar = document.querySelector('[data-state="open"][data-sidebar="sidebar"]');
      if (openSidebar) {
        const closeBtn = openSidebar.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
        closeBtn?.click();
      }
    }
  };

  // Helper to extract initials for user / business avatar
  const getInitials = (nameString?: string) => {
    if (!nameString) return "";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      side="left"
      className="border-r border-slate-900/50"
      style={{
        '--sidebar': '#0B1320',
        '--sidebar-foreground': '#f8fafc',
        '--sidebar-border': 'rgba(255, 255, 255, 0.05)',
        '--sidebar-accent': 'rgba(255, 255, 255, 0.04)',
        '--sidebar-accent-foreground': '#ffffff',
      } as React.CSSProperties}
    >
      <SidebarHeader className="p-3.5 pb-2 bg-transparent border-0">
        {/* TallyCashPro Logo and Notification Bell block */}
        <div className="flex items-center justify-between gap-2.5 px-1 py-1.5">
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain shrink-0" />
            <span className="text-[17px] font-bold tracking-tight text-white font-sans truncate">
              TallyCash<span className="text-[#10b981]">Pro</span>
            </span>
          </Link>
          <div className="text-white/60 hover:text-white transition-colors duration-200">
            <NotificationBell />
          </div>
        </div>

        {/* Business Selector capsule */}
        <div className="mt-3 px-0.5 w-full flex justify-center">
          <DropdownMenu onOpenChange={(open) => { if (!open) setBusinessSearchQuery(""); }}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full flex items-center justify-between bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer rounded-full p-1 pl-1.5 pr-3 shadow-md h-[46px] border border-slate-200 outline-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#3b82f6] text-white font-bold shrink-0 text-xs uppercase animate-scale-in">
                    {getInitials(business.businessInfo.name) || "B"}
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="font-bold text-[12px] text-slate-800 truncate block leading-tight">
                      {business.businessInfo.name || "Select Business"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5">
                      {isCashbookListPending ? "Loading..." : `${cashbookList?.length || 0} Books`}
                    </span>
                  </div>
                </div>
                <ChevronDown className="size-3.5 text-slate-500 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[218px] max-h-[380px] overflow-y-auto rounded-2xl p-1.5 shadow-2xl bg-white z-[10000]" align="start" side="bottom" sideOffset={8}>
              {/* Search Input */}
              <div className="px-2 py-1.5">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={businessSearchQuery}
                  onChange={(e) => setBusinessSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-lg outline-none focus:border-slate-400 bg-slate-50 text-slate-800"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {isCompanyListPending ? (
                <div className="px-3 py-2 text-xs text-slate-400">Loading businesses...</div>
              ) : businesses && businesses.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {(() => {
                    const filtered = (businesses || []).filter((b: any) =>
                      b.company.name.toLowerCase().includes(businessSearchQuery.toLowerCase())
                    );
                    const displayLimit = 5;
                    const displayed = filtered.slice(0, displayLimit);

                    if (displayed.length === 0) {
                      return <div className="px-3 py-2 text-xs text-slate-400">No matching businesses</div>;
                    }

                    return (
                      <>
                        {displayed.map((b: any) => {
                          const isSelected = b.company._id === business.businessInfo.id;
                          return (
                            <BusinessDropdownItem
                              key={b.company._id}
                              businessItem={b}
                              isSelected={isSelected}
                              onClick={() => handleBusinessChange(b.company)}
                            />
                          );
                        })}
                        
                        {businesses.length > 5 && (
                          <div className="px-1 py-1 border-t border-slate-100 mt-1">
                            <DropdownMenuItem
                              onClick={() => router.push('/dashboard/business')}
                              className="w-full flex items-center justify-between gap-1 text-slate-600 hover:text-slate-900 font-semibold text-[11px] rounded-lg py-1.5 px-2 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 outline-none border-0"
                            >
                              <span>View All Businesses ({businesses.length})</span>
                              <ChevronRight className="size-3 text-slate-400" />
                            </DropdownMenuItem>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400">No businesses found</div>
              )}
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <div className="p-2 pt-1">
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/business')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-xs rounded-full py-2 px-3 shadow-sm transition-colors cursor-pointer border-0 outline-none focus:bg-[#2563eb] focus:text-white"
                >
                  <span>New Business</span>
                  <Plus className="size-3.5 text-white stroke-[2.5]" />
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="min-h-3 p-2.5 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {newConfig.map((item) => {
                const isActive = (() => {
                  if (pathname.includes('/book')) {
                    return item.title === 'Books';
                  }
                  if (pathname.includes('/activity')) {
                    return item.title === 'Activity Logs';
                  }
                  if (pathname.includes('/report')) {
                    return item.title === 'Reports';
                  }
                  if (pathname.includes('/help')) {
                    return item.title === 'Help & FAQ';
                  }
                  if (pathname.includes('/team-management')) {
                    return item.title === 'Team Management';
                  }
                  if (item.title === 'Businesses') {
                    return pathname === item.url;
                  }
                  return pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url));
                })();
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`w-full rounded-xl px-3 py-2.5 h-10 transition-all duration-200 border-0 ${isActive
                        ? 'bg-gradient-to-r from-[#0088FF] to-[#1DB46B] text-white font-bold shadow-md'
                        : 'text-white/70 hover:bg-white/5 hover:text-white font-medium'
                        }`}
                    >
                      <Link href={item.url} onClick={handleLinkClick} title={item.title} className="flex items-center gap-2.5">
                        <item.icon className={`size-[18px] ${isActive ? 'text-white' : 'text-white/60'}`} />
                        <span className="text-[13px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User profile footer matching the image, wrapped in DropdownMenu */}
      <SidebarFooter className="border-t border-white/5 p-3 bg-transparent">
        <div className="flex items-center gap-2 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 flex items-center gap-2.5 text-left hover:bg-white/5 p-1.5 rounded-xl transition-all duration-200 outline-none border-0 cursor-pointer min-w-0">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#3b82f6] text-white font-extrabold shrink-0 text-xs uppercase animate-scale-in">
                  {getInitials(user?.name || user?.displayName) || "U"}
                </div>
                <div className="flex flex-col text-left min-w-0 animate-fade-in">
                  <span className="font-semibold text-xs text-white truncate block leading-tight">
                    {user ? (user.name || user.displayName || "User") : "Guest"}
                  </span>
                  <span className="text-[9px] text-white/40 truncate block mt-0.5">
                    {user?.email || ""}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 mb-2 bg-[#0B1320] border border-white/10 text-white rounded-xl shadow-xl p-1.5 z-[10000]" align="start" side="top">
              <DropdownMenuLabel className="font-normal px-2.5 py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-xs font-bold text-white leading-none">
                    {user ? (user.name || user.displayName || "User") : "Guest"}
                  </p>
                  {user?.email && (
                    <p className="text-[10px] text-white/40 truncate leading-none mt-1">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 my-1" />
              <DropdownMenuItem asChild className="text-xs font-medium focus:bg-white/10 focus:text-white rounded-lg cursor-pointer px-2.5 py-2">
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs font-medium focus:bg-white/10 focus:text-white rounded-lg cursor-pointer px-2.5 py-2">
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowLogoutConfirm(true)}
                className="text-xs font-medium focus:bg-white/10 focus:text-white rounded-lg cursor-pointer px-2.5 py-2"
              >
                Log out
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 my-1" />
              <DeleteAccountDialog
                trigger={
                  <DropdownMenuItem
                    className="text-xs font-medium text-red-400 focus:bg-red-500/20 focus:text-red-300 rounded-lg cursor-pointer px-2.5 py-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete Account
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            title="Log Out"
            className="size-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer border-0 outline-none shrink-0"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent
          className="
            max-w-[320px]
            rounded-2xl
            border border-white/10
            bg-[#0B1320]/95
            p-5
            gap-0
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            backdrop-blur-md
            animate-in fade-in-0 zoom-in-95 duration-150
            text-slate-100
          "
        >
          <AlertDialogHeader className="space-y-3">
            {/* Gradient Icon Wrapper */}
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0088FF] to-[#1DB46B] text-white shadow-md shadow-[#0088FF]/15">
              <LogOut className="h-4.5 w-4.5" />
            </div>

            {/* Tighter Typography */}
            <div className="text-center space-y-1">
              <AlertDialogTitle className="text-sm font-bold tracking-tight text-white">
                Sign out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs leading-relaxed text-slate-400 px-1">
                You will need to sign in again to access your account.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          {/* Clean Buttons */}
          <AlertDialogFooter className="mt-5 flex flex-row items-center gap-2 sm:space-x-0">
            <AlertDialogCancel
              className="
                flex-1
                h-9
                mt-0
                rounded-xl
                border border-white/10
                bg-white/5
                text-xs
                font-semibold
                text-slate-300
                hover:bg-white/10
                hover:text-white
                active:scale-[0.98]
                transition-all
                cursor-pointer
              "
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                setShowLogoutConfirm(false);
                logout();
              }}
              className="
                flex-1
                h-9
                rounded-xl
                bg-gradient-to-r
                from-[#0088FF]
                to-[#1DB46B]
                text-xs
                font-bold
                text-white
                hover:opacity-90
                active:scale-[0.98]
                transition-all
                border-0
                cursor-pointer
              "
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}