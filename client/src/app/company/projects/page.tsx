// app/company/projects/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

import { AppSidebar } from '@/components/ui/company/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

import {
  FolderKanban,
  Users,
  PenSquare,
  Trash2,
  Wallet,
  CalendarDays,
  Clock,
  Search,
  Briefcase,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  budget: string;
  timeline: string;
  proposals: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  deadline: string;
  experienceLevel: string;
}

type StatusFilter = 'all' | Project['status'];

export default function CompanyProjects() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/projects`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Projects API response:', data);
          if (data.success) {
            const formattedProjects = data.data.map((project: any) => ({
              id: project.id,
              title: project.title,
              category: project.category || 'General',
              budget: project.budget || 'Not specified',
              timeline: project.timeline || 'Flexible',
              proposals: project.proposalCount || 0,
              status: project.status,
              postedDate: new Date(project.createdAt).toLocaleDateString(),
              deadline: project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not specified',
              experienceLevel: project.experienceLevel || 'Any',
            }));
            setProjects(formattedProjects);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, router]);

  const handleDeleteProject = async (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    const projectTitle = projectToDelete?.title || 'this project';

    if (!confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProjects(projects.filter(project => project.id !== projectId));
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = `Project "${projectTitle}" deleted successfully`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      } else {
        alert(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getStatusBadge = (s: Project['status']) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (s) {
      case 'active':
        return `${base} bg-emerald-100 text-emerald-700`;
      case 'closed':
        return `${base} bg-rose-100 text-rose-700`;
      case 'draft':
        return `${base} bg-amber-100 text-amber-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [projects, status, query]);

  const counts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      draft: projects.filter((p) => p.status === 'draft').length,
      closed: projects.filter((p) => p.status === 'closed').length,
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading projects...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-6 w-6" />
              <span className="text-base font-semibold leading-none sm:text-lg">Projects</span>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/company/projects/post"
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm hover:bg-[#F5EFEB]"
              >
                Post New Project
              </Link>
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
            <SidebarTrigger
              className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
              aria-label="Toggle sidebar"
            />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">
                    Company
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            <section className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_0%_-10%,rgba(16,44,36,0.08),transparent),radial-gradient(800px_200px_at_100%_120%,rgba(86,124,141,0.08),transparent)]" />
              <div className="relative z-10">
                <div className="flex flex-col gap-4 border-b border-[#E3EAF1] p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2F4156]">Your Project Postings</h3>
                    <p className="text-sm text-[#567C8D]">Manage all your freelancer project requests</p>
                  </div>

                  <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                    <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
                      <TabsList className="flex w-full flex-wrap gap-2 bg-[#F5EFEB] p-2">
                        <TabsTrigger value="all">
                          All ({counts.all})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                          Active ({counts.active})
                        </TabsTrigger>
                        <TabsTrigger value="draft">
                          Draft ({counts.draft})
                        </TabsTrigger>
                        <TabsTrigger value="closed">
                          Closed ({counts.closed})
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#567C8D]" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search title, category..."
                        className="w-full rounded-xl border border-[#E3EAF1] bg-white pl-9 text-sm text-[#2F4156] placeholder:text-[#567C8D] focus-visible:ring-emerald-400 lg:w-72"
                      />
                    </div>

                    <Link
                      href="/company/projects/post"
                      className="rounded-xl bg-[#2F4156] px-4 py-2 text-sm text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447]"
                    >
                      Post Project
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-[#E3EAF1]">
                  {filtered.map((project) => (
                    <div key={project.id} className="p-6 transition hover:bg-[#F5EFEB]/50">
                      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#2F4156]">{project.title}</h4>
                          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#567C8D]">
                            <span className="inline-flex items-center gap-2">
                              <Briefcase className="h-4 w-4" /> {project.category}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Wallet className="h-4 w-4" /> {project.budget}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4" /> {project.timeline}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" /> Posted: {project.postedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={getStatusBadge(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          <span className="rounded-full bg-[#E3F2FD] px-3 py-1 text-xs font-semibold text-[#1E88E5]">
                            {project.proposals} proposals
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => router.push(`/company/projects/${project.id}/proposals`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
                        >
                          <Users className="h-4 w-4" />
                          View Proposals
                        </button>
                        <button
                          onClick={() => router.push(`/company/projects/edit/${project.id}`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-4 py-2 text-sm text-white transition hover:bg-[#243447]"
                        >
                          <PenSquare className="h-4 w-4" />
                          Edit Project
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#E3EAF1] px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="p-12 text-center text-[#567C8D]">
                    <svg
                      className="mx-auto mb-4 h-20 w-20 text-[#C8D9E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <p className="mb-2 text-lg text-[#2F4156]">No projects match your filters</p>
                    <p className="mb-4 text-sm">Try a different status or search query</p>
                    <Link
                      href="/company/projects/post"
                      className="rounded-xl bg-[#2F4156] px-5 py-2.5 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447]"
                    >
                      Post a Project
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
