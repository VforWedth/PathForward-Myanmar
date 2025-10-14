// app/company/dashboard/page.tsx
"use client";

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

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  pendingApplications: number;
  feedbackGiven: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplications: 0,
    feedbackGiven: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }
    
    // Mock data - replace with actual API calls
    const mockStats: DashboardStats = {
      totalJobs: 12,
      activeJobs: 8,
      totalApplicants: 45,
      pendingApplications: 15,
      feedbackGiven: 23
    };
    
    const mockActivity = [
      { id: 1, type: 'application', message: 'New application for Frontend Developer', time: '2 hours ago' },
      { id: 2, type: 'job', message: 'Job "Backend Engineer" published', time: '1 day ago' },
      { id: 3, type: 'feedback', message: 'Feedback submitted for Aung Aung', time: '2 days ago' },
      { id: 4, type: 'application', message: 'Application status updated', time: '3 days ago' }
    ];
    
    setStats(mockStats);
    setRecentActivity(mockActivity);
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto p-8 w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {/* Welcome back, {user?.name || 'Company'}! */}
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Manage your job postings, applicants, and student feedback from your dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalApplicants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Feedback Given</p>
                <p className="text-2xl font-bold text-gray-800">{stats.feedbackGiven}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/company/jobs/post"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Post New Job</h3>
                <p className="text-sm text-gray-600">Create a new job listing</p>
              </div>
            </div>
          </Link>

          <Link
            href="/company/applicants"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">View Applicants</h3>
                <p className="text-sm text-gray-600">Manage job applications</p>
              </div>
            </div>
          </Link>

          <Link
            href="/company/feedback"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Student Feedback</h3>
                <p className="text-sm text-gray-600">Provide and view feedback</p>
              </div>
            </div>
          </Link>

          <Link
            href="/company/jobs"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Manage Jobs</h3>
                <p className="text-sm text-gray-600">View all job postings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'application' ? 'bg-blue-500' :
                  activity.type === 'job' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {recentActivity.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}