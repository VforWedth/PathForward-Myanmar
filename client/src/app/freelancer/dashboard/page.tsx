// app/freelancer/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"; // <- your shadcn nav menu file
import {
  Bell,
  Briefcase,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Send,
} from "lucide-react";

type Tabs = "overview" | "jobs" | "projects" | "applications";

interface Job {
  id: string;
  title: string;
  company: string;
  type: "full-time" | "part-time" | "contract" | "freelance";
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  deadline: string;
  status: "open" | "closed";
}

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  partnersNeeded: number;
  currentPartners: number;
  status: "planning" | "recruiting" | "in-progress" | "completed";
  createdBy: string;
  createdAt: string;
  fileUrl?: string;
}

/** ---------- Top Navigation (uses shadcn NavigationMenu) ---------- */
function FreelancerNav({
  activeTab,
  onTabChange,
  onLogout,
  userName = "Freelancer",
}: {
  activeTab: Tabs;
  onTabChange: (t: Tabs) => void;
  onLogout: () => void;
  userName?: string;
}) {
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

          {/* Center menu (desktop) */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <TopLink
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  label="Overview"
                  isActive={activeTab === "overview"}
                  onClick={() => onTabChange("overview")}
                />

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      activeTab === "jobs" ? "bg-accent text-accent-foreground gap-2" : "gap-2"
                    }
                  >
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-3">
                    <div className="grid min-w-[360px] gap-2 md:grid-cols-2">
                      <MenuCard title="All Jobs" desc="See everything new" onClick={() => onTabChange("jobs")} />
                      <MenuCard title="Saved" desc="Your favorites" onClick={() => onTabChange("applications")} />
                      <MenuCard title="Filters" desc="Contract • Remote • Rate" onClick={() => onTabChange("jobs")} />
                      <MenuCard title="Applications" desc="Track status" onClick={() => onTabChange("applications")} />
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

          {/* Right controls */}
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
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-destructive-foreground hover:opacity-90"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile collapsible menu */}
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
      <NavigationMenuLink asChild active={isActive} className="cursor-pointer">
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className={[
            "inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
            "bg-background hover:bg-accent hover:text-accent-foreground",
            isActive ? "bg-accent/60 text-accent-foreground" : "",
          ].join(" ")}
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

/** ---------- Page ---------- */
export default function FreelancerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tabs>("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "freelancer") {
      router.push("/login");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = async () => {
    // Mock data
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Frontend React Developer",
        company: "Tech Solutions Inc.",
        type: "contract",
        location: "Remote",
        salary: "$50-70/hr",
        description:
          "We are looking for an experienced React developer to join our team for a 6-month project.",
        requirements: ["3+ years React experience", "TypeScript", "Redux", "CSS-in-JS"],
        skills: ["React", "TypeScript", "Redux", "CSS"],
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        status: "open",
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "Creative Studio",
        type: "freelance",
        location: "Remote",
        salary: "$40-60/hr",
        description:
          "Looking for a talented UI/UX designer to create beautiful user interfaces for our mobile app.",
        requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
        skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
        postedDate: "2024-01-14",
        deadline: "2024-02-14",
        status: "open",
      },
    ];

    const mockProjectIdeas: ProjectIdea[] = [
      {
        id: "1",
        title: "AI-Powered Task Management App",
        description:
          "Building an intelligent task management application with AI-powered suggestions and automation.",
        skillsRequired: ["React Native", "Node.js", "Machine Learning", "MongoDB"],
        partnersNeeded: 3,
        currentPartners: 1,
        status: "recruiting",
        createdBy: "John Doe",
        createdAt: "2024-01-10",
      },
      {
        id: "2",
        title: "E-commerce Platform for Local Artisans",
        description:
          "Creating a platform to help local artisans sell their products online with custom storefronts.",
        skillsRequired: ["Next.js", "Stripe", "Tailwind CSS", "PostgreSQL"],
        partnersNeeded: 2,
        currentPartners: 0,
        status: "planning",
        createdBy: "Sarah Wilson",
        createdAt: "2024-01-12",
      },
    ];

    setJobs(mockJobs);
    setProjectIdeas(mockProjectIdeas);
    setIsLoading(false);
  };

  const handleApplyJob = (jobId: string) => {
    toast.success(`Application submitted for job #${jobId}`);
  };

  const handleSaveJob = (jobId: string) => {
    toast.info(`Job #${jobId} saved to favorites`);
  };

  const handleJoinProject = (projectId: string) => {
    toast.success(`Request sent to join project #${projectId}`);
  };

  const stats = {
    appliedJobs: 5,
    activeProjects: 2,
    completedProjects: 8,
    earnings: "$12,500",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* shadcn top nav */}
      <FreelancerNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        userName={user?.name ?? "Freelancer"}
      />

      <div className="max-w-7xl mx-auto p-8">
        {/* CONTENT */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                tone="blue"
                label="Applied Jobs"
                value={stats.appliedJobs}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                tone="green"
                label="Active Projects"
                value={stats.activeProjects}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
              <StatCard
                tone="purple"
                label="Completed"
                value={stats.completedProjects}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                tone="yellow"
                label="Total Earnings"
                value={stats.earnings}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                }
              />

            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickAction
                tone="blue"
                title="Browse Jobs"
                desc="Find your next freelance opportunity"
                onClick={() => setActiveTab("jobs")}
              />
              <QuickAction
                tone="green"
                title="Project Ideas"
                desc="Collaborate on innovative projects"
                onClick={() => setActiveTab("projects")}
              />
              <QuickAction
                tone="purple"
                title="Post Project Idea"
                desc="Share your idea and find partners"
                onClick={() => router.push("/freelancer/projects/new")}
              />
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Available Jobs</h2>
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-card text-card-foreground p-6 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{job.salary}</p>
                      <p className="text-sm text-muted-foreground">{job.type}</p>
                    </div>
                  </div>

                  <p className="mb-4">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Posted: {job.postedDate} • Deadline: {job.deadline}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className="px-4 py-2 rounded-lg border hover:bg-accent hover:text-accent-foreground"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Project Ideas</h2>
              <button
                onClick={() => router.push("/freelancer/projects/new")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                Post New Idea
              </button>
            </div>

            <div className="grid gap-6">
              {projectIdeas.map((project) => (
                <div key={project.id} className="bg-card text-card-foreground p-6 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground">
                        By {project.createdBy} • {project.createdAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-sm",
                          project.status === "recruiting"
                            ? "bg-green-100 text-green-800"
                            : project.status === "planning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800",
                        ].join(" ")}
                      >
                        {project.status}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.currentPartners}/{project.partnersNeeded} partners
                      </p>
                    </div>
                  </div>

                  <p className="mb-4">{project.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Skills Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Looking for {project.partnersNeeded - project.currentPartners} more partners
                    </div>
                    <button
                      onClick={() => handleJoinProject(project.id)}
                      disabled={project.currentPartners >= project.partnersNeeded}
                      className={[
                        "px-4 py-2 rounded-lg",
                        project.currentPartners >= project.partnersNeeded
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700",
                      ].join(" ")}
                    >
                      {project.currentPartners >= project.partnersNeeded ? "Full" : "Join Project"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="bg-card text-card-foreground p-6 rounded-lg shadow border">
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            <p className="text-muted-foreground">Your job applications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** ---------- Tiny UI helpers ---------- */
function StatCard({
  tone,
  label,
  value,
  icon,
}: {
  tone: "blue" | "green" | "purple" | "yellow";
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow border">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${toneMap[tone]}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  tone,
  title,
  desc,
  onClick,
}: {
  tone: "blue" | "green" | "purple";
  title: string;
  desc: string;
  onClick: () => void;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <button
      onClick={onClick}
      className="bg-card text-card-foreground p-6 rounded-lg shadow border text-left hover:shadow-lg transition-shadow"
    >
      <div className={`p-3 rounded-lg inline-flex mb-4 ${toneMap[tone]}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}
