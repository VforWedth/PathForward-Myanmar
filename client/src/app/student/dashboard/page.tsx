'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      {/* Navbar */}
      <nav className="bg-[#2F4156] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-[#567C8D] text-white hover:bg-[#C8D9E6] hover:text-[#2F4156] transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-[#2F4156] mb-6">
          {/* Welcome, {user?.role || 'Student'} 👋 */}
          Welcome
        </h2>

        {/* Dashboard Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/student/profile"
            className="bg-white border border-[#C8D9E6] rounded-xl p-6 shadow-sm hover:shadow-md hover:bg-[#C8D9E6]/20 transition"
          >
            <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
              Profile Management
            </h3>
            <p className="text-[#567C8D]">
              View and update your personal information, skills, and CV.
            </p>
          </Link>

          <Link
            href="/student/applications"
            className="bg-white border border-[#C8D9E6] rounded-xl p-6 shadow-sm hover:shadow-md hover:bg-[#C8D9E6]/20 transition"
          >
            <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
              Job Applications
            </h3>
            <p className="text-[#567C8D]">
              Track your submitted applications and their current status.
            </p>
          </Link>

          <Link
            href="/student/reviews"
            className="bg-white border border-[#C8D9E6] rounded-xl p-6 shadow-sm hover:shadow-md hover:bg-[#C8D9E6]/20 transition"
          >
            <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
              Company Reviews
            </h3>
            <p className="text-[#567C8D]">
              Read feedback from other students about different companies.
            </p>
          </Link>
        </div>

        {/* Analytics / Notifications */}
        <div className="mt-10 bg-white border border-[#C8D9E6] rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-[#2F4156] mb-4">
            Your Activity Summary
          </h3>
          <ul className="list-disc pl-6 text-[#567C8D] space-y-2">
            <li>Uploaded CV successfully</li>
            <li>Applied to 2 jobs this week</li>
            <li>Received 1 company feedback</li>
          </ul>
          <p className="mt-4 text-gray-500">
            (Analytics and notifications will be dynamically updated soon.)
          </p>
        </div>
      </div>
    </div>
  );
}
