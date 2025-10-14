// app/company/jobs/page.tsx
'use client';

import { useEffect, useState } from 'react';
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

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  deadline: string;
}

export default function CompanyJobs() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    // Mock data - replace with API call
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Frontend Developer',
        type: 'Full-time',
        location: 'Yangon',
        salary: '$2,000 - $3,000',
        applications: 15,
        status: 'active',
        postedDate: '2024-01-10',
        deadline: '2024-02-10',
      },
      {
        id: '2',
        title: 'Backend Engineer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$2,500 - $3,500',
        applications: 8,
        status: 'active',
        postedDate: '2024-01-12',
        deadline: '2024-02-12',
      },
      {
        id: '3',
        title: 'UI/UX Designer',
        type: 'Part-time',
        location: 'Mandalay',
        salary: '$1,500 - $2,000',
        applications: 12,
        status: 'active',
        postedDate: '2024-01-08',
        deadline: '2024-02-08',
      },
    ];

    setJobs(mockJobs);
    setIsLoading(false);
  }, [user, router]);

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header same as dashboard */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Jobs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto pr-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/company/jobs/post"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Post New Job
                </Link>
                <button
                  onClick={() => router.push('/company/dashboard')}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto p-8 w-full">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Your Job Postings</h3>
                <p className="text-gray-600">Manage all your job listings</p>
              </div>

              <div className="divide-y">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span>📍 {job.location}</span>
                          <span>💼 {job.type}</span>
                          <span>💰 {job.salary}</span>
                          <span>📅 Posted: {job.postedDate}</span>
                          <span>⏰ Deadline: {job.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {job.applications} applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => router.push(`/company/applicants?job=${job.id}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        View Applicants
                      </button>
                      <button
                        onClick={() => { /* TODO: handle edit */ }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit Job
                      </button>
                      <button
                        onClick={() => { /* TODO: handle delete */ }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <svg
                    className="w-20 h-20 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg mb-2">No jobs posted yet</p>
                  <p className="text-sm mb-4">Start by posting your first job opportunity</p>
                  <Link
                    href="/company/jobs/post"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Job
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
