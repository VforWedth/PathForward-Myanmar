"use client"

import * as React from "react"
import {
  Briefcase,
  FileText,
  MessageSquare,
  PlusCircle,
  Users,
} from "lucide-react"
import logo from "@/media/logo.png";
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "../team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore"

const companyNav = {
  user: {
    name: "Company User",
    email: "company@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Your Company",
      logo: Briefcase,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Company",
      url: "/company",
      icon: Briefcase,
      items: [
        { title: "Dashboard", url: "/company/dashboard" },
        { title: "Applicants", url: "/company/applicants" },
        { title: "Feedback", url: "/company/feedback" },
      ],
    },
    {
      title: "Post Jobs",
      url: "/company/jobs/post",
      icon: FileText,
      items: [
        { title: "All Jobs", url: "/company/jobs" },
        { title: "Post Job", url: "/company/jobs/post" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore();

  const sidebarUser = {
    name: user?.email?.split('@')[0] ?? "Company Admin",
    email: user?.email ?? "",
    avatar: logo.src,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
            <TeamSwitcher
            team={{
                name: "PathForward",
                logo:  logo.src,
                plan: "Company",
            }}
            />

      </SidebarHeader>
      <SidebarContent>
        <NavMain items={companyNav.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={sidebarUser}
          onLogout={logout}
          onProfile={() => console.log("profile")}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
