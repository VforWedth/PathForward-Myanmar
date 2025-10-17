"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { LogOut, Bell, Briefcase, LayoutDashboard, Lightbulb, Send } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"; // ← the file you pasted
import { cn } from "@/lib/utils";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";

type Tabs = "overview" | "jobs" | "projects" | "applications";

export function FreelancerNav({
  activeTab,
  onTabChange,
  onLogout,
  userName = "Freelancer",
}: {
  activeTab: Tabs;
  onTabChange: (tab: Tabs) => void;
  onLogout: () => void;
  userName?: string;
}) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };
  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 grid place-items-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold">Freelancer Dashboard</span>
          </div>

          {/* Center Nav (shadcn NavigationMenu) */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <TopLink
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  label="Overview"
                  isActive={activeTab === "overview"}
                  onClick={() => onTabChange("overview")}
                />

                {/* Jobs with dropdown content example */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "gap-2",
                      activeTab === "jobs" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-3">
                    <div className="grid min-w-[360px] gap-2 md:grid-cols-2">
                      <MenuCard
                        title="All Jobs"
                        desc="See everything new"
                        onClick={() => onTabChange("jobs")}
                      />
                      <MenuCard
                        title="Saved"
                        desc="Your favorites"
                        onClick={() => onTabChange("applications")} // or a separate Saved tab if you add one
                      />
                      <MenuCard
                        title="Filters"
                        desc="Contract • Remote • Rate"
                        onClick={() => onTabChange("jobs")}
                      />
                      <MenuCard
                        title="Applications"
                        desc="Track status"
                        onClick={() => onTabChange("applications")}
                      />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <TopLink
                  icon={<Lightbulb className="h-4 w-4" />}
                  label="Project Ideas"
                  isActive={activeTab === "projects"}
                  onClick={() => onTabChange("projects")}
                />

                <TopLink
                  icon={<Send className="h-4 w-4" />}
                  label="My Applications"
                  isActive={activeTab === "applications"}
                  onClick={() => onTabChange("applications")}
                />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: notifications + user + logout */}
          <div className="flex items-center gap-3">
            <button
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground grid place-items-center">
                3
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border">
              <div className="h-6 w-6 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary">
                {userName?.[0]?.toUpperCase() ?? "F"}
              </div>
              <span className="text-sm">{userName}</span>
            </div>
            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-destructive-foreground hover:opacity-90"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile: simple compact menu using the same tabs */}
            <div className="md:hidden">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2">
                      <div className="flex flex-col min-w-[220px]">
                        <MobileLink label="Overview" onClick={() => onTabChange("overview")} />
                        <MobileLink label="Browse Jobs" onClick={() => onTabChange("jobs")} />
                        <MobileLink label="Project Ideas" onClick={() => onTabChange("projects")} />
                        <MobileLink label="My Applications" onClick={() => onTabChange("applications")} />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Centralized Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutDialog(false)}
        isLoading={isLoggingOut}
      />
    </nav>
  );
}

function TopLink({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        asChild
        active={isActive}
        className={cn(
          "cursor-pointer",
          isActive && "data-[active=true]:text-accent-foreground"
        )}
      >
        {/* Use <button> so we can switch tabs without navigation */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
            "bg-background hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent/60 text-accent-foreground"
          )}
        >
          {icon}
          {label}
        </button>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function MenuCard({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border p-3 text-left hover:bg-accent hover:text-accent-foreground transition"
    >
      <div className="text-sm font-semibold">{title}</div>
      {desc ? <div className="text-xs text-muted-foreground mt-1">{desc}</div> : null}
    </button>
  );
}

function MobileLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </button>
  );
}
