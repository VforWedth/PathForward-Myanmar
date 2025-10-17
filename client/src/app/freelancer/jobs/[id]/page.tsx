'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Globe,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryRange?: string;
  deadline?: string;
  skillsRequired: string[];
  majorsPreferred: string[];
  experienceLevel: string;
  numberOfPositions: number;
  Company: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    logo?: string;
    description?: string;
    website?: string;
  };
  hasApplied?: boolean;
  application?: any;
}

export default function JobDetails() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchJobDetails();
  }, [user, router, params.id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/jobs/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJob(data.data);
      } else {
        toast.error('Job not found or not available');
        router.push('/freelancer/jobs');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    setIsApplying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/jobs/${job.id}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            coverLetter: coverLetter.trim() || null
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Application submitted successfully!');
        setShowApplyModal(false);
        setCoverLetter('');
        fetchJobDetails(); // Refresh to update applied status
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer' || !job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/freelancer/jobs')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Job Details</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4 mb-6">
                {job.Company.logo ? (
                  <img
                    src={job.Company.logo}
                    alt={job.Company.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{job.Company.companyName}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {job.workMode}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                      {job.experienceLevel} Level
                    </span>
                  </div>
                </div>
              </div>

              {job.hasApplied && job.application && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">You have applied for this job</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.application.status)}`}>
                      {job.application.status}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Applied on {formatDate(job.application.createdAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Responsibilities</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Requirements</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            {/* Skills Required */}
            {job.skillsRequired.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Majors */}
            {job.majorsPreferred.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferred Majors</h2>
                <div className="flex flex-wrap gap-2">
                  {job.majorsPreferred.map((major, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Apply Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {!job.hasApplied ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                  >
                    Already Applied
                  </button>
                )}
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Company</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-5 w-5" />
                    <span>{job.Company.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-5 w-5" />
                    <span>{job.Company.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{job.Company.location}</span>
                  </div>
                  {job.Company.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-5 w-5" />
                      <a
                        href={job.Company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                {job.Company.description && (
                  <p className="mt-4 text-sm text-gray-600">{job.Company.description}</p>
                )}
              </div>

              {/* Job Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Positions</span>
                    <span className="font-medium text-gray-800">{job.numberOfPositions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level</span>
                    <span className="font-medium text-gray-800 capitalize">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium text-gray-800">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Mode</span>
                    <span className="font-medium text-gray-800">{job.workMode}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium text-gray-800">{formatDate(job.deadline)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply for {job.title}</h2>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Cover Letter <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Tell the employer why you're a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                A well-written cover letter can help your application stand out.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setCoverLetter('');
                }}
                disabled={isApplying}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
