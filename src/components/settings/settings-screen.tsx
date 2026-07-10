"use client";

import Link from "next/link";
import {
  ChevronRight,
  HelpCircle,
  KeyRound,
  LogOut,
  MonitorSmartphone,
  Pencil,
  Trash2,
  Volume2,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { useEffect, useState } from "react";
import {
  isTransactionSoundEnabled,
  playTransactionSound,
  setTransactionSoundEnabled,
} from "@/lib/transaction-sound";
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.[0] ?? "U").toUpperCase();
}

interface SettingsRowProps {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  href?: string;
  trailing?: React.ReactNode;
  showChevron?: boolean;
}

function SettingsRow({
  icon,
  iconClassName,
  title,
  subtitle,
  onClick,
  href,
  trailing,
  showChevron = true,
}: SettingsRowProps) {
  const inner = (
    <>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconClassName ?? "bg-slate-100 text-slate-600",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? (
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
        ) : null}
      </div>
      {trailing ??
        (showChevron && href ? (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
        ) : null)}
    </>
  );

  const rowClass =
    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50/90";

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {inner}
    </button>
  );
}

function SettingsToggleRow({
  icon,
  iconClassName,
  title,
  subtitle,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconClassName ?? "bg-slate-100 text-slate-600",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? (
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
    </div>
  );
}

function SettingsCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-0.5">
        {title}
      </h2>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        {children}
      </div>
    </section>
  );
}

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const [playSound, setPlaySound] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setPlaySound(isTransactionSoundEnabled());
  }, []);

  const handleSoundToggle = (checked: boolean) => {
    setPlaySound(checked);
    setTransactionSoundEnabled(checked);
    if (checked) {
      playTransactionSound();
    }
  };

  const displayName = user?.name || user?.displayName || "User";
  const email = user?.email ?? "";
  const photoURL = user?.photoURL?.trim() || "";
  const initials = getInitials(displayName);

  const handleSignOutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="w-full space-y-4 pb-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          {email ? (
            <p className="text-sm text-slate-500 truncate">{email}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 h-9 cursor-pointer"
          onClick={handleSignOutClick}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 to-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-11 w-11 shrink-0 rounded-xl">
            {photoURL ? (
              <AvatarImage
                src={photoURL}
                alt={displayName}
                className="object-cover rounded-xl"
              />
            ) : null}
            <AvatarFallback className="rounded-xl bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-slate-900 truncate">
              {displayName}
            </p>
            {email ? (
              <p className="text-xs text-slate-500 truncate">{email}</p>
            ) : null}
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 shrink-0 ml-auto" asChild>
            <Link href="/dashboard/profile">
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <SettingsCard title="App & security">
          <SettingsToggleRow
            icon={<Volume2 className="h-5 w-5" />}
            title="Play transaction sound"
            subtitle="Sound on cash in / cash out"
            checked={playSound}
            onCheckedChange={handleSoundToggle}
          />
          <SettingsRow
            icon={<MonitorSmartphone className="h-5 w-5" />}
            iconClassName="bg-blue-50 text-blue-600"
            title="Logged-in Devices"
            subtitle="Manage active sessions"
            href="/dashboard/settings/devices"
          />
        </SettingsCard>

        <SettingsCard title="Account">
          <SettingsRow
            icon={<Pencil className="h-5 w-5" />}
            iconClassName="bg-blue-50 text-blue-600"
            title="Edit Profile"
            subtitle="Update your personal information"
            href="/dashboard/profile"
          />
          <SettingsRow
            icon={<HelpCircle className="h-5 w-5" />}
            iconClassName="bg-emerald-50 text-emerald-600"
            title="FAQ & Help"
            subtitle="Get help and learn about features"
            href="/dashboard/help"
          />
          <SettingsRow
            icon={<LogOut className="h-5 w-5" />}
            iconClassName="bg-amber-50 text-amber-600"
            title="Sign Out"
            subtitle="Sign out of your account"
            onClick={handleSignOutClick}
            showChevron={false}
          />
          <DeleteAccountDialog
            trigger={
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-red-50/80 border-t border-slate-100 cursor-pointer"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-600">Delete Account</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Permanent deletion — cannot be undone
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-red-300" />
              </button>
            }
          />
        </SettingsCard>
      </div>

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
    </div>
  );
}
