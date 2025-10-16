"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AuthGuard from "@/components/AuthGuard";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";
import { useLogout } from "@/hooks/useLogout";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";

// shadcn/ui sidebar primitives
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// your role-aware sidebar
import { AppSidebar } from "@/components/ui/university/app-sidebar"; // adjust import path

export default function UniversityDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab] = useState("overview");
  const { initiateLogout, confirmLogout, cancelLogout, showConfirm, isLoggingOut } = useLogout();

  // AuthGuard will handle authentication and role checking

  const [universityStats, setUniversityStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    partnerCompanies: 0,
    pendingApprovals: 0,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "Loading...", time: "", type: "loading" },
  ]);

  useEffect(() => {
    if (user && user.role === "university") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch employment stats
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/employment-stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setUniversityStats(prev => ({
            ...prev,
            totalStudents: statsData.stats.students.total,
            activeInternships: statsData.stats.students.onJob,
            pendingApprovals: statsData.stats.applications.pending,
          }));
        }
      }

      // Fetch connection requests for pending approvals
      const requestsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        if (requestsData.success) {
          setUniversityStats(prev => ({
            ...prev,
            pendingApprovals: requestsData.total
          }));
        }
      }

      // Fetch connected companies count
      const connectedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connected-companies`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (connectedResponse.ok) {
        const connectedData = await connectedResponse.json();
        if (connectedData.success) {
          setUniversityStats(prev => ({
            ...prev,
            partnerCompanies: connectedData.total
          }));
        }
      }

      // Mock recent activities for now
      setRecentActivities([
        { id: 1, action: "New student registration", time: "2 hours ago", type: "student" },
        { id: 2, action: "Internship application approved", time: "5 hours ago", type: "approval" },
        { id: 3, action: "New company partnership request", time: "1 day ago", type: "partnership" },
        { id: 4, action: "Student profile updated", time: "1 day ago", type: "update" },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <AuthGuard requiredRole="university">
      {/* Session timeout warning */}
      <SessionTimeoutWarning />

      <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content pane */}
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">PathForward</h1>
              <span className="text-sm text-gray-600">University Portal</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">University Admin</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={initiateLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>

              {/* Logout confirmation dialog */}
              <LogoutConfirmDialog
                isOpen={showConfirm}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
                isLoading={isLoggingOut}
              />
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Welcome */}
            <section className="px-4 py-6 sm:px-0">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>
                  <p className="text-gray-600">
                    Manage your students, internships, and company partnerships from one centralized dashboard.
                  </p>
                </div>
              </div>
            </section>

            {/* Dashboard tiles — now aligned to your sections/paths */}
            <section id="stats" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCardLink
                href="/university/students"
                title="Manage Students"
                value={universityStats.totalStudents}
                iconBg="bg-blue-100"
                iconText="text-blue-600"
                svg={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                }
              />
              <StatCardLink
                href="/university/connections"
                title="Company Connections"
                value={universityStats.partnerCompanies}
                iconBg="bg-green-100"
                iconText="text-green-600"
                svg={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                }
              />
              <StatCardLink
                href="/university/employment"
                title="Employment Tracking"
                value={universityStats.activeInternships}
                iconBg="bg-purple-100"
                iconText="text-purple-600"
                svg={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                }
              />
              <StatCardLink
                href="/university/connections"
                title="Pending Approvals"
                value={universityStats.pendingApprovals}
                iconBg="bg-yellow-100"
                iconText="text-yellow-600"
                svg={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                }
              />
            </section>

            {/* Recent Activity */}
            <section className="mt-8 grid grid-cols-1 gap-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div id="activity" className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {recentActivities.map((activity) => (
                      <li key={activity.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ✅ Quick Actions REMOVED as requested */}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </AuthGuard>
  );
}

/* ---------- clickable stat card helper ---------- */

function StatCardLink({
  href,
  title,
  value,
  iconBg,
  iconText,
  svg,
}: {
  href: string;
  title: string;
  value: number | string;
  iconBg: string;
  iconText: string;
  svg: JSX.Element;
}) {
  return (
    <Link
      href={href}
      aria-label={title}
      className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
    >
      <div className="bg-white overflow-hidden shadow rounded-lg transition ring-1 ring-transparent group-hover:shadow-md group-hover:ring-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${iconBg} rounded-md p-3`}>
              <svg className={`h-6 w-6 ${iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {svg}
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
