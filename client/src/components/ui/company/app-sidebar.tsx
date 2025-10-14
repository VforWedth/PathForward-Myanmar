"use client"

import * as React from "react"
import {
  Briefcase,
  FileText,
  MessageSquare,
  PlusCircle,
  Users,
  GraduationCap,
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
    {
      title: "Universities",
      url: "/company/universities",
      icon: GraduationCap,
      items: [
        { title: "Browse Universities", url: "/company/universities" },
        { title: "My Connections", url: "/company/universities/connected" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
  user={{
    name: "Aung Aung",
    email: "aung@example.com",
    avatar: logo.src, // or leave undefined for initials
  }}
  onLogout={() => console.log("logout")}
  onProfile={() => console.log("profile")}
/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
