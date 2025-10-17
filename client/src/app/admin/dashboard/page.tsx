'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import AuthGuard from '@/components/AuthGuard';

// Types
interface DashboardStats {
  users: {
    total: number;
    students: number;
    companies: number;
    universities: number;
    freelancers: number;
  };
  pendingVerifications: {
    companies: number;
    universities: number;
    total: number;
  };
  jobs: {
    active: number;
  };
  applications: {
    total: number;
    recent: number;
  };
}

interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'student' | 'company' | 'university' | 'admin' | 'freelancer';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface PendingVerification {
  id: string;
  companyName?: string;
  universityName?: string;
  type: 'company' | 'university';
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
  verificationStatus: string;
  createdAt: string;
  User?: {
    email: string;
    phone?: string;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
  Company?: {
    id: string;
    companyName: string;
  };
}

interface ActivityLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  admin?: {
    id: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<PendingVerification[]>([]);
  const [pendingUniversities, setPendingUniversities] = useState<PendingVerification[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [userFilter, setUserFilter] = useState({ role: '', status: '', search: '' });
  const [jobFilter, setJobFilter] = useState({ status: '', search: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } else {
        toast.error('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: userPage.toString(),
        limit: '20',
        ...(userFilter.role && { role: userFilter.role }),
        ...(userFilter.search && { search: userFilter.search })
      });

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users);
        }
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pending verifications
  const fetchPendingVerifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Fetch pending companies
      const companiesResponse = await fetch(`${API_URL}/admin/companies/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        if (companiesData.success) {
          setPendingCompanies(companiesData.data);
        }
      }

      // Fetch pending universities
      const universitiesResponse = await fetch(`${API_URL}/admin/universities/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (universitiesResponse.ok) {
        const universitiesData = await universitiesResponse.json();
        if (universitiesData.success) {
          setPendingUniversities(universitiesData.data);
        }
      }
    } catch (error) {
      console.error('Fetch verifications error:', error);
      toast.error('Failed to load pending verifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: jobPage.toString(),
        limit: '20',
        ...(jobFilter.status && { status: jobFilter.status }),
        ...(jobFilter.search && { search: jobFilter.search })
      });

      const response = await fetch(`${API_URL}/admin/jobs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setJobs(data.data.jobs);
        }
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: activityPage.toString(),
        limit: '50'
      });

      const response = await fetch(`${API_URL}/admin/activity?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActivityLogs(data.data.logs);
        }
      }
    } catch (error) {
      console.error('Fetch activity logs error:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  // User actions
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: editUserData.email,
          phone: editUserData.phone,
          isVerified: editUserData.isVerified,
          isActive: editUserData.isActive
        })
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setShowUserModal(false);
        fetchUsers();
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update user');
    }
  };

  const handleToggleUserActive = async (userId: string) => {
    if (!confirm('Are you sure you want to change this user\'s active status?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-active`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('User status updated');
        fetchUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Toggle user active error:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    }
  };

  // Verification actions
  const handleVerifyCompany = async (companyId: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this company?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/companies/${companyId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Company ${status} successfully`);
        fetchPendingVerifications();
        fetchDashboardStats();
        setShowVerificationModal(false);
      } else {
        toast.error(`Failed to ${status} company`);
      }
    } catch (error) {
      console.error('Verify company error:', error);
      toast.error('Failed to verify company');
    }
  };

  const handleVerifyUniversity = async (universityId: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this university?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/universities/${universityId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`University ${status} successfully`);
        fetchPendingVerifications();
        fetchDashboardStats();
        setShowVerificationModal(false);
      } else {
        toast.error(`Failed to ${status} university`);
      }
    } catch (error) {
      console.error('Verify university error:', error);
      toast.error('Failed to verify university');
    }
  };

  // Job actions
  const handleDeleteJob = async (jobId: string) => {
    const reason = prompt('Please provide a reason for deleting this job:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        toast.success('Job deleted successfully');
        fetchJobs();
        fetchDashboardStats();
        setShowJobModal(false);
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Delete job error:', error);
      toast.error('Failed to delete job');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchDashboardStats();
  }, [user, router]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!user) return;

    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'verification':
        fetchPendingVerifications();
        break;
      case 'jobs':
        fetchJobs();
        break;
      case 'activity':
        fetchActivityLogs();
        break;
    }
  }, [activeTab, userPage, jobPage, activityPage, userFilter, jobFilter]);

  // Modal Components
  const UserEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Edit User</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editUserData.email || ''}
                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editUserData.phone || ''}
                onChange={(e) => setEditUserData({...editUserData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editUserData.isVerified || false}
                  onChange={(e) => setEditUserData({...editUserData, isVerified: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Verified</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editUserData.isActive || false}
                  onChange={(e) => setEditUserData({...editUserData, isActive: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VerificationDetailsModal = () => {
    const isCompany = selectedVerification?.type === 'company';
    const name = isCompany ? selectedVerification?.companyName : selectedVerification?.universityName;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Verification Details: {name}</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${isCompany ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {selectedVerification?.type}
                  </span>
                </div>
              </div>

              {selectedVerification?.industry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <p className="text-gray-900">{selectedVerification.industry}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900">{selectedVerification?.location || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <p className="text-gray-900">{selectedVerification?.User?.email || 'N/A'}</p>
              </div>

              {selectedVerification?.website && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <a href={selectedVerification.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                    {selectedVerification.website}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{selectedVerification?.description || 'No description provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                <p className="text-gray-900">{new Date(selectedVerification?.createdAt || '').toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (isCompany) {
                    handleVerifyCompany(selectedVerification!.id, 'rejected');
                  } else {
                    handleVerifyUniversity(selectedVerification!.id, 'rejected');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  if (isCompany) {
                    handleVerifyCompany(selectedVerification!.id, 'approved');
                  } else {
                    handleVerifyUniversity(selectedVerification!.id, 'approved');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JobDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedJob?.title}</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <p className="text-gray-900">{selectedJob?.Company?.companyName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${selectedJob?.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedJob?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {selectedJob?.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900 whitespace-pre-line">{selectedJob?.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted Date</label>
              <p className="text-gray-900">{new Date(selectedJob?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowJobModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => handleDeleteJob(selectedJob!.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render functions
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.users.total || 0}</p>
        <div className="mt-3 text-xs text-gray-600">
          <div>Students: {stats?.users.students || 0}</div>
          <div>Companies: {stats?.users.companies || 0}</div>
          <div>Universities: {stats?.users.universities || 0}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Verifications</h3>
        <p className="text-3xl font-bold text-yellow-600">{stats?.pendingVerifications.total || 0}</p>
        <div className="mt-3 text-xs text-gray-600">
          <div>Companies: {stats?.pendingVerifications.companies || 0}</div>
          <div>Universities: {stats?.pendingVerifications.universities || 0}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Active Jobs</h3>
        <p className="text-3xl font-bold text-green-600">{stats?.jobs.active || 0}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Applications</h3>
        <p className="text-3xl font-bold text-purple-600">{stats?.applications.total || 0}</p>
        <div className="mt-3 text-xs text-gray-600">
          <div>Recent (7 days): {stats?.applications.recent || 0}</div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <div className="flex gap-2">
          <select
            value={userFilter.role}
            onChange={(e) => setUserFilter({...userFilter, role: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="company">Company</option>
            <option value="university">University</option>
            <option value="freelancer">Freelancer</option>
          </select>
          <input
            type="text"
            placeholder="Search email..."
            value={userFilter.search}
            onChange={(e) => setUserFilter({...userFilter, search: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'company' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'university' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.isVerified && <span className="ml-2 text-xs text-green-600">✓ Verified</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setEditUserData(user);
                      setShowUserModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleUserActive(user.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );

  const renderVerificationSystem = () => {
    const allPending = [
      ...pendingCompanies.map(c => ({ ...c, type: 'company' as const })),
      ...pendingUniversities.map(u => ({ ...u, type: 'university' as const }))
    ];

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Pending Verifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allPending.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.companyName || item.universityName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${item.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.location || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedVerification(item);
                        setShowVerificationModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        if (item.type === 'company') {
                          handleVerifyCompany(item.id, 'approved');
                        } else {
                          handleVerifyUniversity(item.id, 'approved');
                        }
                      }}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (item.type === 'company') {
                          handleVerifyCompany(item.id, 'rejected');
                        } else {
                          handleVerifyUniversity(item.id, 'rejected');
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allPending.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No pending verifications
          </div>
        )}
      </div>
    );
  };

  const renderJobMonitoring = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Job Post Monitoring</h3>
        <div className="flex gap-2">
          <select
            value={jobFilter.status}
            onChange={(e) => setJobFilter({...jobFilter, status: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <input
            type="text"
            placeholder="Search jobs..."
            value={jobFilter.search}
            onChange={(e) => setJobFilter({...jobFilter, search: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{job.Company?.companyName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                      job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(job.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowJobModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {jobs.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No jobs found
        </div>
      )}
    </div>
  );

  const renderActivityTracking = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Platform Activity Tracking</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activityLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.admin?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.targetType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activityLogs.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No activity logs found
        </div>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Welcome, Admin!</h2>
            <p className="text-gray-600">
              Manage your platform efficiently with the tools below.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'users', name: 'User Management' },
                { id: 'verification', name: 'Verification System' },
                { id: 'jobs', name: 'Job Monitoring' },
                { id: 'activity', name: 'Activity Tracking' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {isLoading && activeTab !== 'dashboard' ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUserManagement()}
              {activeTab === 'verification' && renderVerificationSystem()}
              {activeTab === 'jobs' && renderJobMonitoring()}
              {activeTab === 'activity' && renderActivityTracking()}
            </>
          )}
        </div>

        {/* Modals */}
        {showUserModal && <UserEditModal />}
        {showVerificationModal && <VerificationDetailsModal />}
        {showJobModal && <JobDetailsModal />}
      </div>
    </AuthGuard>
  );
}
