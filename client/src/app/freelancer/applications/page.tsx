'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  FileText,
  Trash2
} from 'lucide-react';

interface Application {
  id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  createdAt: string;
  Job: {
    id: string;
    title: string;
    jobType: string;
    workMode: string;
    location: string;
    salaryRange?: string;
    deadline?: string;
    Company: {
      id: string;
      companyName: string;
      industry: string;
      location: string;
      logo?: string;
    };
  };
}

export default function MyApplications() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchApplications();
  }, [user, router, filterStatus]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/applications?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/applications/${applicationId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Application withdrawn successfully');
        fetchApplications();
        setSelectedApplication(null);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'shortlisted':
        return '⭐';
      case 'reviewing':
        return '👀';
      default:
        return '⏳';
    }
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  const filteredApplications = applications;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/freelancer/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
                <p className="text-sm text-gray-600">Track your job applications</p>
              </div>
            </div>
            <Link
              href="/freelancer/jobs"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="text-sm text-gray-600">
              {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
            </span>
          </div>
        </div>

        {/* Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">
                  {filterStatus !== 'all'
                    ? 'Try changing the filter to see more applications'
                    : "You haven't applied to any jobs yet"}
                </p>
                {filterStatus === 'all' && (
                  <Link
                    href="/freelancer/jobs"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition hover:shadow-md ${
                      selectedApplication?.id === application.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {application.Job.Company.logo ? (
                          <img
                            src={application.Job.Company.logo}
                            alt={application.Job.Company.companyName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {application.Job.title}
                          </h3>
                          <p className="text-gray-600">{application.Job.Company.companyName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)} {application.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.Job.location}</span>
                      </div>
                      {application.Job.salaryRange && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{application.Job.salaryRange}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Applied: {formatDate(application.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {application.Job.jobType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {application.Job.workMode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg shadow-sm p-6">
              {selectedApplication ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)} {selectedApplication.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Applied Date</p>
                      <p className="text-gray-800">{formatDate(selectedApplication.createdAt)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Job Title</p>
                      <p className="text-gray-800 font-medium">{selectedApplication.Job.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Company</p>
                      <p className="text-gray-800">{selectedApplication.Job.Company.companyName}</p>
                    </div>

                    {selectedApplication.coverLetter && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Cover Letter</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {selectedApplication.coverLetter}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.Job.deadline && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Application Deadline</p>
                        <p className="text-gray-800">{formatDate(selectedApplication.Job.deadline)}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      <Link
                        href={`/freelancer/jobs/${selectedApplication.Job.id}`}
                        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                      >
                        View Job Details
                      </Link>

                      {selectedApplication.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(selectedApplication.id)}
                          className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Withdraw Application
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select an application to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
