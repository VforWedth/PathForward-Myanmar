'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryRange?: string;
  deadline?: string;
  skillsRequired: string[];
  experienceLevel: string;
  Company: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    logo?: string;
  };
  createdAt: string;
}

export default function FindJobs() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    jobType: 'all',
    workMode: 'all',
    experienceLevel: 'all',
    location: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchJobs();
  }, [user, router, pagination.page]);

  const handleApplyFilters = () => {
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
    fetchJobs();
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      if (filters.search) params.append('search', filters.search);
      if (filters.jobType !== 'all') params.append('jobType', filters.jobType);
      if (filters.workMode !== 'all') params.append('workMode', filters.workMode);
      if (filters.experienceLevel !== 'all') params.append('experienceLevel', filters.experienceLevel);
      if (filters.location) params.append('location', filters.location);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/jobs?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
      'freelance': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

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
                <h1 className="text-2xl font-bold text-gray-800">Find Jobs</h1>
                <p className="text-sm text-gray-600">Browse available job opportunities</p>
              </div>
            </div>
            <Link
              href="/freelancer/applications"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              My Applications
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, skills..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filters.workMode}
                onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
              >
                <option value="all">All Modes</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="ojt">OJT</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h3>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/freelancer/jobs/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {job.Company.logo ? (
                      <img
                        src={job.Company.logo}
                        alt={job.Company.companyName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.Company.companyName}</p>
                      <p className="text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                    {job.jobType}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salaryRange}</span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{job.workMode}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{job.experienceLevel}</span>
                  </div>
                </div>

                {job.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{job.skillsRequired.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && jobs.length > 0 && pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
