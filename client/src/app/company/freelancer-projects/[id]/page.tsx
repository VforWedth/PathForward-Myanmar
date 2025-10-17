// app/company/freelancer-projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Users,
  Clock,
  Code,
  FileText,
  Globe,
  DollarSign,
} from 'lucide-react';

interface ProjectDetails {
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
    availability: string;
    hourlyRate: string;
    User?: {
      email: string;
      phone: string;
    };
  };
}

export default function FreelancerProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchProjectDetails();
  }, [user, router, params.id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/freelancer-projects/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProject(data.data);
        }
      } else {
        router.push('/company/freelancer-projects');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      router.push('/company/freelancer-projects');
    } finally {
      setIsLoading(false);
    }
  };

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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
            <div className="text-[#567C8D]">Loading project details...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!project) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
            <div className="text-[#567C8D]">Project not found</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
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
            <Link
              href="/company/freelancer-projects"
              className="inline-flex items-center gap-2 text-white hover:text-white/80"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Projects
            </Link>
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
                  <BreadcrumbLink href="/company/freelancer-projects" className="hover:text-white">
                    Explore Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-[#2F4156] mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-[#567C8D]">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {project.Freelancer ? `${project.Freelancer.firstName} ${project.Freelancer.lastName}` : 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{getProjectTypeLabel(project.projectType)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {getProjectTypeLabel(project.projectType)}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full capitalize">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Description */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#2F4156] mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Description
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                </div>

                {/* Skills Required */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#2F4156] mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.map((skill, index) => (
                      <span key={index} className="px-3 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                {project.timeline && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[#2F4156] mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timeline
                    </h2>
                    <p className="text-gray-700">{project.timeline}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-[#2F4156] mb-4">Project Details</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-[#567C8D] mb-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Partners Needed</span>
                      </div>
                      <p className="text-lg font-bold text-[#2F4156]">{project.partnersNeeded}</p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    Contact Freelancer
                  </button>
                </div>

                {/* Freelancer Info */}
                {project.Freelancer && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-[#2F4156] mb-4">About the Freelancer</h3>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-[#2F4156]">
                          {project.Freelancer.firstName} {project.Freelancer.lastName}
                        </h4>
                        {project.Freelancer.availability && (
                          <p className="text-sm text-[#567C8D] capitalize">{project.Freelancer.availability}</p>
                        )}
                      </div>

                      {project.Freelancer.bio && (
                        <p className="text-sm text-gray-700">{project.Freelancer.bio}</p>
                      )}

                      {project.Freelancer.hourlyRate && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-[#567C8D]" />
                          <span className="text-gray-700">${project.Freelancer.hourlyRate}/hour</span>
                        </div>
                      )}

                      {project.Freelancer.skills && project.Freelancer.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-[#567C8D] mb-2 font-medium">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.Freelancer.skills.slice(0, 6).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.Freelancer.portfolioUrl && (
                        <a
                          href={project.Freelancer.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Globe className="h-4 w-4" />
                          View Portfolio
                        </a>
                      )}

                      {project.Freelancer.User && (
                        <div className="border-t pt-3 mt-3 space-y-2">
                          {project.Freelancer.User.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="h-4 w-4 text-[#567C8D]" />
                              <a href={`mailto:${project.Freelancer.User.email}`} className="hover:text-blue-600">
                                {project.Freelancer.User.email}
                              </a>
                            </div>
                          )}
                          {project.Freelancer.User.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="h-4 w-4 text-[#567C8D]" />
                              <a href={`tel:${project.Freelancer.User.phone}`} className="hover:text-blue-600">
                                {project.Freelancer.User.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
