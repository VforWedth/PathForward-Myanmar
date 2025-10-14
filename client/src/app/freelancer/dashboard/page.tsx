'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'company' | 'university' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  phone?: string;
  company?: string;
  website?: string;
}

interface Verification {
  id: number;
  name: string;
  type: 'company' | 'university';
  submittedDate: string;
  documents: string[];
  contactEmail: string;
  description?: string;
}

interface JobPost {
  id: number;
  title: string;
  company: string;
  status: 'active' | 'pending' | 'rejected';
  postedDate: string;
  applications: number;
  description: string;
  location: string;
  salary?: string;
  requirements: string[];
}

interface Activity {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

// Mock data
const mockAnalytics = {
  totalUsers: 1250,
  activeUsers: 892,
  pendingVerifications: 23,
  totalJobs: 456,
  newRegistrations: 15,
};

const mockUsers: User[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'user', 
    status: 'active', 
    joinDate: '2023-01-15',
    phone: '+1 234-567-8900'
  },
  { 
    id: 2, 
    name: 'Tech Corp', 
    email: 'admin@techcorp.com', 
    role: 'company', 
    status: 'pending', 
    joinDate: '2023-02-20',
    phone: '+1 234-567-8901',
    company: 'Tech Corp',
    website: 'https://techcorp.com'
  },
  { 
    id: 3, 
    name: 'State University', 
    email: 'admin@stateuniversity.edu', 
    role: 'university', 
    status: 'active', 
    joinDate: '2023-03-10',
    phone: '+1 234-567-8902',
    company: 'State University',
    website: 'https://stateuniversity.edu'
  },
];

const mockPendingVerifications: Verification[] = [
  { 
    id: 1, 
    name: 'Tech Corp', 
    type: 'company', 
    submittedDate: '2023-10-01',
    documents: ['business_license.pdf', 'tax_certificate.pdf'],
    contactEmail: 'legal@techcorp.com',
    description: 'Technology company specializing in software development'
  },
  { 
    id: 2, 
    name: 'State University', 
    type: 'university', 
    submittedDate: '2023-10-02',
    documents: ['accreditation_certificate.pdf', 'charter_document.pdf'],
    contactEmail: 'registrar@stateuniversity.edu',
    description: 'Public university with 20,000 students'
  },
];

const mockJobPosts: JobPost[] = [
  { 
    id: 1, 
    title: 'Frontend Developer', 
    company: 'Tech Corp', 
    status: 'active', 
    postedDate: '2023-10-01', 
    applications: 15,
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    location: 'Remote',
    salary: '$80,000 - $100,000',
    requirements: ['React', 'TypeScript', '3+ years experience']
  },
  { 
    id: 2, 
    title: 'Backend Engineer', 
    company: 'Dev Solutions', 
    status: 'pending', 
    postedDate: '2023-10-02', 
    applications: 0,
    description: 'Backend developer needed for microservices architecture...',
    location: 'New York, NY',
    salary: '$90,000 - $120,000',
    requirements: ['Node.js', 'Python', 'AWS', '5+ years experience']
  },
];

const mockActivities: Activity[] = [
  { 
    id: 1, 
    action: 'User Registration', 
    user: 'New User', 
    timestamp: '2023-10-05 10:30:00',
    details: 'New user registered with email: newuser@example.com',
    ipAddress: '192.168.1.100'
  },
  { 
    id: 2, 
    action: 'Job Post Created', 
    user: 'Tech Corp', 
    timestamp: '2023-10-05 09:15:00',
    details: 'Created job: Senior Full Stack Developer',
    ipAddress: '192.168.1.101'
  },
  { 
    id: 3, 
    action: 'Verification Submitted', 
    user: 'State University', 
    timestamp: '2023-10-05 08:45:00',
    details: 'Submitted university verification documents',
    ipAddress: '192.168.1.102'
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: number; data: any } | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});

  useEffect(() => {
    if (!user || user.role !== 'freelancer') {
      router.push('/login');
    }    
  }, [user, router]);

  // Modal Handlers
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserData(user);
    setShowUserModal(true);
  };

  const handleViewVerification = (verification: Verification) => {
    setSelectedVerification(verification);
    setShowVerificationModal(true);
  };

  const handleViewJob = (job: JobPost) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleConfirmAction = (type: string, id: number, data: any) => {
    setConfirmAction({ type, id, data });
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (!confirmAction) return;

    // Here you would typically make API calls
    console.log(`Executing ${confirmAction.type} for ID: ${confirmAction.id}`, confirmAction.data);
    
    // Simulate API call
    setTimeout(() => {
      alert(`${confirmAction?.type} action completed successfully!`);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }, 1000);
  };

  const handleSaveUser = () => {
    // API call to update user
    console.log('Saving user:', editUserData);
    setShowUserModal(false);
    setSelectedUser(null);
    setEditUserData({});
  };

  // Modal Components
  const UserEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Edit User: {selectedUser?.name}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editUserData.name || ''}
                onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editUserData.role || ''}
                onChange={(e) => setEditUserData({...editUserData, role: e.target.value as User['role']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="company">Company</option>
                <option value="university">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editUserData.status || ''}
                onChange={(e) => setEditUserData({...editUserData, status: e.target.value as User['status']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
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
              onClick={handleSaveUser}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VerificationDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Details: {selectedVerification?.name}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedVerification?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${selectedVerification?.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {selectedVerification?.type}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <p className="text-gray-900">{selectedVerification?.contactEmail}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedVerification?.description || 'No description provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Documents</label>
              <div className="space-y-2">
                {selectedVerification?.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{doc}</span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
              <p className="text-gray-900">{selectedVerification?.submittedDate}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const JobDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedJob?.title}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <p className="text-gray-900">{selectedJob?.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${selectedJob?.status === 'active' ? 'bg-green-100 text-green-800' : 
                    selectedJob?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {selectedJob?.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900">{selectedJob?.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <p className="text-gray-900">{selectedJob?.salary || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900 whitespace-pre-line">{selectedJob?.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <ul className="list-disc list-inside space-y-1">
                {selectedJob?.requirements.map((req, index) => (
                  <li key={index} className="text-gray-900">{req}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posted Date</label>
                <p className="text-gray-900">{selectedJob?.postedDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applications</label>
                <p className="text-gray-900">{selectedJob?.applications}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowJobModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
          <p className="text-gray-600 mb-4">
            {confirmAction?.type === 'suspend' && 'Are you sure you want to suspend this user? They will not be able to access their account.'}
            {confirmAction?.type === 'approve' && 'Are you sure you want to approve this verification/job?'}
            {confirmAction?.type === 'reject' && 'Are you sure you want to reject this verification/job? This action cannot be undone.'}
            {confirmAction?.type === 'delete' && 'Are you sure you want to delete this job post? This action cannot be undone.'}
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={executeAction}
              className={`px-4 py-2 text-white rounded-md ${
                confirmAction?.type === 'suspend' || confirmAction?.type === 'reject' || confirmAction?.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Rest of the component remains the same with updated action handlers...
  const renderUserManagement = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'company' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'university' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleConfirmAction('suspend', user.id, user)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVerificationSystem = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Pending Verifications</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPendingVerifications.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.submittedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleConfirmAction('approve', item.id, item)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleConfirmAction('reject', item.id, item)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleViewVerification(item)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobMonitoring = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Job Post Monitoring</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockJobPosts.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'active' ? 'bg-green-100 text-green-800' : 
                      job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{job.postedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.applications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewJob(job)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  {job.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleConfirmAction('approve', job.id, job)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleConfirmAction('reject', job.id, job)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleConfirmAction('delete', job.id, job)}
                    className="text-red-600 hover:text-red-900 ml-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ... (rest of the component remains the same)

  return (
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
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Dashboard content remains the same */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{mockAnalytics.totalUsers}</p>
            </div>
            {/* ... other dashboard cards */}
          </div>
        )}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'verification' && renderVerificationSystem()}
        {activeTab === 'jobs' && renderJobMonitoring()}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Platform Activity Tracking</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User/Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{activity.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{activity.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{activity.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{activity.details}</p>
                          <p className="text-xs text-gray-500">IP: {activity.ipAddress}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserModal && <UserEditModal />}
      {showVerificationModal && <VerificationDetailsModal />}
      {showJobModal && <JobDetailsModal />}
      {showConfirmModal && <ConfirmationModal />}
    </div>
  );
}