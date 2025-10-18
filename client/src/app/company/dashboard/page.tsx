'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Sparkles, Briefcase, Users, MessageSquare, PlusCircle } from 'lucide-react';
import { TopApplicants, CompanyApplicant } from './top-applicants';
import { AppSidebar } from '@/components/ui/company/app-sidebar';
import { FAQSection } from '@/components/faq/FAQSection';
import { getFAQsByCategory, getGeneralFAQs } from '@/components/faq/FAQData';
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

type DashboardStats = {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  pendingApplications: number;
  feedbackGiven: number;
}

interface CompanyProfile {
  companyName: string;
  industry: string;
  verificationStatus: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplications: 0,
    feedbackGiven: 0,
  });
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topApplicants, setTopApplicants] = useState<CompanyApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_URL}/company/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      // Fetch recent activity
      const activityResponse = await fetch(`${API_URL}/company/dashboard/activity`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        if (activityData.success) {
          setRecentActivity(activityData.data);
        }
      }

      // Fetch company profile
      const profileResponse = await fetch(`${API_URL}/company/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setCompanyProfile(profileData.data);
        }
      }

      // Fetch top applicants
      const applicantsResponse = await fetch(`${API_URL}/company/applicants?limit=3&sort=recent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (applicantsResponse.ok) {
        const applicantsData = await applicantsResponse.json();
        console.log('Applicants API Response:', applicantsData); // Debug log
        if (applicantsData.success && applicantsData.data) {
          // Transform backend data to match frontend interface
          const transformedApplicants = applicantsData.data.map((app: any) => ({
            id: app.id,
            name: app.applicant?.name || 'Unknown',
            email: app.applicant?.email || 'N/A',
            position: app.position || app.Job?.title || 'N/A',
            status: app.status,
            appliedDate: app.createdAt,
            skills: app.applicant?.skills || [],
            experience: app.applicant?.experience || 'N/A',
            education: app.applicant?.education || 'N/A',
            location: app.applicant?.location || 'N/A',
          }));
          console.log('Transformed Applicants:', transformedApplicants); // Debug log
          setTopApplicants(transformedApplicants);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Gradient Header */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            {/* ✅ SidebarTrigger on LEFT */}
            <div className="flex items-center gap-3">
        
              <Briefcase className="h-6 w-6" />
              <span className="text-base font-semibold sm:text-lg">Company Dashboard</span>
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/company/jobs/post"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                <PlusCircle className="h-4 w-4" /> Post Job
              </Link>
              <Link
                href="/company/applicants"
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm"
              >
                <Users className="h-4 w-4" /> View Applicants
              </Link>
            </div>
          </div>

          {/* Breadcrumb Row */}
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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* ✅ SidebarTrigger for mobile */}
            <div className="ml-auto md:hidden">
              <SidebarTrigger className="text-white" aria-label="Toggle sidebar" />
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            {/* Welcome Section */}
            <section className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_0%_-10%,rgba(16,44,36,0.08),transparent),radial-gradient(800px_200px_at_100%_120%,rgba(86,124,141,0.08),transparent)]" />
              <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                    <Sparkles className="h-4 w-4" /> Welcome back
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#2F4156] md:text-3xl">
                    {companyProfile?.companyName ? `Hi, ${companyProfile.companyName} 👋` : user?.name ? `Hi, ${user.name} 👋` : 'Welcome 👋'}
                  </h2>
                  <p className="mt-2 max-w-prose text-[#567C8D]">
                    Manage postings, track applicants, and share feedback—all in one place.
                  </p>
                </div>

                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[
                    { label: 'Jobs', value: stats.totalJobs },
                    { label: 'Applicants', value: stats.totalApplicants },
                    { label: 'Pending', value: stats.pendingApplications },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-[#E3EAF1] bg-white/90 p-4 text-center shadow-sm"
                    >
                      <div className="text-2xl font-bold text-[#2F4156]">{s.value}</div>
                      <div className="text-xs text-[#567C8D]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Top Applicants */}
            <section className="mt-8">
              <TopApplicants applicants={topApplicants} limit={3} />
            </section>

            {/* Recent Activity */}
            <section className="mt-10">
              <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#2F4156]" />
                  <h4 className="text-lg font-semibold text-[#2F4156]">Recent activity</h4>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center space-x-4 rounded-lg p-3 hover:bg-[#F5EFEB]"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          a.type === 'application'
                            ? 'bg-emerald-500'
                            : a.type === 'job'
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-[#2F4156]">{a.message}</p>
                        <p className="text-sm text-[#567C8D]">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mt-10">
              <FAQSection
                faqs={[...getFAQsByCategory('companies'), ...getGeneralFAQs()]}
                title="Company Help & FAQ"
              />
            </section>
          </div>
                <footer className="mx-auto mt-12 max-w-7xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Built with ♥ for learners — PathForward Myanmar
      </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
