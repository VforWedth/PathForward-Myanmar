"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Users, Building2, FileCheck2, ClipboardList, Command, Link as LinkIcon, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { FAQSidebarLink } from "@/components/faq/FAQSidebarLink";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/ui/university/nav-user";

/** Helper to mark active link */
function withActive<T extends { url: string }>(items: T[], pathname: string): (T & { isActive?: boolean })[] {
  return items.map((it) => ({
    ...it,
    isActive: pathname === it.url || pathname.startsWith(it.url),
  }));
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [universityName, setUniversityName] = useState("PathForward");

  const role = user?.role ?? "university";

  // Fetch university name
  useEffect(() => {
    const fetchUniversityProfile = async () => {
      if (user && user.role === 'university') {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/profile`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.university?.universityName) {
              setUniversityName(data.university.universityName);
            }
          }
        } catch (error) {
          console.error('Error fetching university profile:', error);
        }
      }
    };

    fetchUniversityProfile();
  }, [user]);

  // Navigation links
  const navItems = withActive(
    [
      { title: "Dashboard", url: "/university/dashboard", icon: LayoutDashboard },
      { title: "Manage Students", url: "/university/students", icon: Users },
      { title: "Company Connections", url: "/university/companies", icon: Building2 },
      { title: "Connection Management", url: "/university/connections", icon: LinkIcon },
      { title: "Employment Tracking", url: "/university/employment", icon: FileCheck2 },
      // { title: "University Registration", url: "/university/registration", icon: ClipboardList },
    ],
    pathname
  );

  const sidebarUser = {
    name: user?.email?.split('@')[0] ?? "University Admin",
    email: user?.email ?? "",
    avatar: "/avatars/placeholder.png",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/university">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{universityName}</span>
                  <span className="truncate text-xs">University Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  item.isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
              >
                <Icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* FAQ Link at bottom of sidebar */}
        <div className="mt-auto px-2">
          <FAQSidebarLink />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
