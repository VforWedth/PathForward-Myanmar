'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { StudentTopNav } from '@/components/ui/student/top-nav';
import * as studentApi from '@/lib/studentApi';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Search,
  Filter,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  workMode: 'onsite' | 'remote' | 'ojt' | 'hybrid';
  jobType: 'internship' | 'full-time' | 'part-time' | 'contract' | 'freelance';
  salaryRange?: string;
  skillsRequired: string[];
  majorsPreferred: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  status: string;
  deadline?: string;
  numberOfPositions: number;
  Company: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    logo?: string;
    website?: string;
  };
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function BrowseJobsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [university, setUniversity] = useState<{ id: string; name: string } | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    workMode: '',
    experienceLevel: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchJobs();
  }, [user, router, pagination.page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentApi.getAvailableJobs({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response.success) {
        setJobs(response.jobs || []);
        setPagination(response.pagination);
        if (response.university) {
          setUniversity(response.university);
        }
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      if (err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        setVerificationStatus(err.response.data.verificationStatus);
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Failed to load jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchJobs();
  };

  const getWorkModeColor = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      case 'ojt':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
        return 'bg-green-100 text-green-800';
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (requiresVerification) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />
        <main className="relative mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-amber-100 p-3">
                <AlertCircle className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#2F4156]">
              Verification Required
            </h2>
            <p className="mb-6 text-[#567C8D]">
              {error || 'You must be a verified student to browse jobs from connected companies.'}
            </p>
            {verificationStatus === 'pending' && (
              <p className="mb-6 text-sm text-[#567C8D]">
                Your verification request is currently pending. Please wait for your university to approve it.
              </p>
            )}
            {verificationStatus === 'rejected' && (
              <p className="mb-6 text-sm text-red-600">
                Your verification was rejected. Please resubmit with correct information.
              </p>
            )}
            <div className="flex justify-center gap-3">
              {verificationStatus !== 'pending' && (
                <Link
                  href="/student/verify-university"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-6 py-3 text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-[#243447]"
                >
                  <Building2 className="h-5 w-5" />
                  {verificationStatus === 'rejected' ? 'Resubmit Verification' : 'Verify Your University'}
                </Link>
              )}
              <Link
                href="/student/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2F4156]">Browse Jobs</h1>
              {university && (
                <p className="mt-1 text-sm text-[#567C8D]">
                  Showing opportunities from companies partnered with {university.name}
                </p>
              )}
            </div>
            <Link
              href="/student/dashboard"
              className="rounded-xl bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-[#567C8D]" />
            <h2 className="text-lg font-semibold text-[#2F4156]">Filters</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-[#567C8D]" />
                <input
                  type="text"
                  placeholder="Search by job title or description..."
                  className="w-full rounded-lg border border-[#C8D9E6] pl-10 pr-3 py-2 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                Job Type
              </label>
              <select
                className="w-full rounded-lg border border-[#C8D9E6] px-3 py-2 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                Work Mode
              </label>
              <select
                className="w-full rounded-lg border border-[#C8D9E6] px-3 py-2 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={filters.workMode}
                onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
              >
                <option value="">All Modes</option>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="ojt">OJT</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className="rounded-xl bg-[#2F4156] px-6 py-2 text-white transition hover:bg-[#243447]"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#2F4156]" />
            <span className="ml-2 text-[#567C8D]">Loading jobs...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-[#C8D9E6] bg-white p-8 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#567C8D]" />
            <p className="text-[#567C8D]">
              No jobs found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {job.Company.logo && (
                        <img
                          src={job.Company.logo}
                          alt={job.Company.companyName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#2F4156]">{job.title}</h3>
                        <p className="text-[#567C8D]">{job.Company.companyName}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                            {job.jobType}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getWorkModeColor(job.workMode)}`}>
                            {job.workMode}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          {job.experienceLevel && (
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                              {job.experienceLevel} level
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#567C8D] line-clamp-2">
                      {job.description}
                    </p>
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.skillsRequired.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 5 && (
                          <span className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                            +{job.skillsRequired.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm text-[#567C8D]">
                      {job.salaryRange && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salaryRange}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.numberOfPositions} position{job.numberOfPositions > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <Link
                      href={`/student/jobs/${job.id}`}
                      className="rounded-xl bg-[#2F4156] px-6 py-2 text-center text-white transition hover:bg-[#243447]"
                    >
                      View Details
                    </Link>
                    {job.Company.website && (
                      <a
                        href={job.Company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Company
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-[#567C8D]">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="rounded-lg bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="rounded-lg bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
