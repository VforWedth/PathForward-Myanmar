// app/company/freelancer-projects/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';

import {
  Lightbulb,
  Search,
  User,
  Briefcase,
  Users,
  Clock,
  ArrowRight,
  Code,
} from 'lucide-react';

interface FreelancerProject {
  id: string;
  title: string;
  description: string;
  projectType: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
  skillsRequired: string[];
  partnersNeeded: number;
  timeline: string;
  status: string;
  createdAt: string;
  Freelancer?: {
    firstName: string;
    lastName: string;
    skills: string[];
    bio: string;
    portfolioUrl: string;
  };
}

export default function CompanyFreelancerProjects() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [projects, setProjects] = useState<FreelancerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchProjects();
  }, [user, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/freelancer-projects`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching freelancer projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || project.projectType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [projects, searchQuery, typeFilter]);

  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      web: 'Web Application',
      mobile: 'Mobile App',
      desktop: 'Desktop Software',
      ai: 'AI/ML',
      other: 'Other'
    };
    return labels[type] || type;
  };

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
              <Lightbulb className="h-6 w-6" />
              <span className="text-base font-semibold leading-none sm:text-lg">Explore Freelancer Projects</span>
            </div>

            <div className="hidden items-center gap-2 md:flex">
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
                  <BreadcrumbPage>Explore Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full pl-10 rounded-lg border border-[#E3EAF1] bg-white text-[#2F4156]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-[#E3EAF1] bg-white text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop Software</option>
                    <option value="ai">AI/ML</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm text-[#567C8D]">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
                <p className="text-gray-600">
                  {searchQuery || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No freelancer projects available at the moment'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-[#E3EAF1]"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#2F4156] mb-2">{project.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-[#567C8D]">
                            <User className="h-4 w-4" />
                            <span className="font-medium">
                              {project.Freelancer ? `${project.Freelancer.firstName} ${project.Freelancer.lastName}` : 'Anonymous'}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {getProjectTypeLabel(project.projectType)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-xs text-[#567C8D] mb-2">
                          <Code className="h-3 w-3" />
                          <span className="font-medium">Skills Needed</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsRequired.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.skillsRequired.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{project.skillsRequired.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{project.partnersNeeded} {project.partnersNeeded === 1 ? 'Partner' : 'Partners'} Needed</span>
                        </div>
                        {project.timeline && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{project.timeline}</span>
                          </div>
                        )}
                      </div>

                      {/* Posted Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Clock className="h-3 w-3" />
                        <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/company/freelancer-projects/${project.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#243447] transition-colors"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
