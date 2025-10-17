'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Briefcase, DollarSign, Clock, TrendingUp, Plus, Search, FileText, Users, FolderKanban } from 'lucide-react';

export default function FreelancerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Freelancer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name || user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Your Freelancer Dashboard!
          </h2>
          <p className="text-gray-600">
            Manage your projects, track your earnings, and grow your freelance business.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">5</h3>
              </div>
              <Briefcase className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">$3,240</h3>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hours This Week</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">32</h3>
              </div>
              <Clock className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Earned</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">$24.5k</h3>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/freelancer/projects/new"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <Plus className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">New Project</h3>
              <p className="text-sm opacity-90">Start a new project</p>
            </div>
          </Link>

          <Link
            href="/freelancer/projects"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <Briefcase className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">My Projects</h3>
              <p className="text-sm opacity-90">View all projects</p>
            </div>
          </Link>

          <Link
            href="/freelancer/company-projects"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <FolderKanban className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Find Projects</h3>
              <p className="text-sm opacity-90">Browse company projects</p>
            </div>
          </Link>

          <Link
            href="/freelancer/jobs"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <Search className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Find Jobs</h3>
              <p className="text-sm opacity-90">Browse available jobs</p>
            </div>
          </Link>

          <Link
            href="/freelancer/applications"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <FileText className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">My Applications</h3>
              <p className="text-sm opacity-90">Track applications</p>
            </div>
          </Link>

          <Link
            href="/freelancer/teammates"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-4"
          >
            <Users className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Find Teammates</h3>
              <p className="text-sm opacity-90">Connect with talent</p>
            </div>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Projects</h3>
            <Link
              href="/freelancer/projects"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Project 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">Website Redesign Project</h4>
                    <p className="text-sm text-gray-600">Tech Startup Inc.</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                  <span>💰 $2,500</span>
                  <span>⏰ Due: Nov 30, 2024</span>
                  <span>📊 70% Complete</span>
                </div>
              </div>

              {/* Project 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">Mobile App Development</h4>
                    <p className="text-sm text-gray-600">E-commerce Solutions</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Pending Review
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                  <span>💰 $4,200</span>
                  <span>⏰ Due: Dec 15, 2024</span>
                  <span>📊 100% Complete</span>
                </div>
              </div>

              {/* Project 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">Logo Design Package</h4>
                    <p className="text-sm text-gray-600">Local Restaurant</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Starting Soon
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                  <span>💰 $800</span>
                  <span>⏰ Due: Dec 5, 2024</span>
                  <span>📊 0% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Projects</span>
                <span className="font-semibold text-gray-800">$2,400</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ongoing Projects</span>
                <span className="font-semibold text-gray-800">$840</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-green-600 text-lg">$3,240</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Profile Strength</span>
                  <span className="text-sm font-semibold text-gray-800">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">✅ Profile photo uploaded</p>
                <p className="text-sm text-gray-600">✅ Skills added</p>
                <p className="text-sm text-gray-600">✅ Portfolio added</p>
                <p className="text-sm text-gray-400">⏸ Add more work samples</p>
                <p className="text-sm text-gray-400">⏸ Complete bio section</p>
              </div>
              <Link
                href="/freelancer/profile"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Complete Your Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
