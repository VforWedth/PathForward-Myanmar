'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Briefcase, DollarSign, Clock, TrendingUp, Plus, Search, FileText, Users, FolderKanban } from 'lucide-react';
import { toast } from 'react-toastify';

interface DashboardStats {
  activeProjects: number;
  totalProjects: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  profileCompletion: number;
  availability: string;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'project';
  title: string;
  description: string;
  status: string;
  date: string;
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [freelancerProfile, setFreelancerProfile] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalProjects: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    profileCompletion: 0,
    availability: 'available'
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Fetch profile
      const profileResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.user.Freelancer) {
          setFreelancerProfile({
            firstName: profileData.user.Freelancer.firstName,
            lastName: profileData.user.Freelancer.lastName
          });
        }
      }

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_URL}/freelancer/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      } else {
        toast.error('Failed to load dashboard statistics');
      }

      // Fetch recent activities
      const activitiesResponse = await fetch(`${API_URL}/freelancer/dashboard/recent-activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        if (activitiesData.success) {
          setRecentActivities(activitiesData.data);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

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
            <span className="text-gray-600">
              {freelancerProfile ? `Welcome, ${freelancerProfile.firstName} ${freelancerProfile.lastName}` : user.name ? `Welcome, ${user.name}` : `Welcome, ${user.email}`}
            </span>
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
            {freelancerProfile ? `Hi, ${freelancerProfile.firstName} ${freelancerProfile.lastName} 👋` : user.name ? `Hi, ${user.name} 👋` : 'Welcome 👋'}
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
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeProjects}</h3>
              </div>
              <Briefcase className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalApplications}</h3>
              </div>
              <FileText className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Applications</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingApplications}</h3>
              </div>
              <Clock className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProjects}</h3>
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

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
            <Link
              href="/freelancer/projects"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'active' || activity.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'in-progress' || activity.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                        activity.status === 'completed' || activity.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <span>{activity.type === 'project' ? '📁 Project' : '📄 Application'}</span>
                      <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No recent activities yet</p>
                <p className="text-sm mt-2">Start applying for jobs or creating projects!</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Applications</span>
                <span className="font-semibold text-gray-800">{stats.totalApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Review</span>
                <span className="font-semibold text-yellow-600">{stats.pendingApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accepted</span>
                <span className="font-semibold text-green-600">{stats.acceptedApplications}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Success Rate</span>
                <span className="font-bold text-green-600 text-lg">
                  {stats.totalApplications > 0
                    ? `${Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Profile Strength</span>
                  <span className="text-sm font-semibold text-gray-800">{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.profileCompletion}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                {stats.profileCompletion === 100 ? (
                  <p className="text-sm text-green-600">✅ Profile Complete!</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Complete your profile to increase visibility</p>
                    <p className="text-sm text-gray-400">• Add bio, skills, and portfolio</p>
                    <p className="text-sm text-gray-400">• Set hourly rate and availability</p>
                  </>
                )}
              </div>
              {stats.profileCompletion < 100 && (
                <Link
                  href="/freelancer/profile"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Complete Your Profile →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
