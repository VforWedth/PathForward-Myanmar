'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  Loader2,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  workMode: string;
  jobType: string;
  salaryRange?: string;
  skillsRequired: string[];
  majorsPreferred: string[];
  experienceLevel: string;
  deadline?: string;
  numberOfPositions: number;
  Company: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    logo?: string;
    website?: string;
    description?: string;
  };
}

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchJobDetails();
  }, [user, router, params.id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getJobDetails(params.id as string);
      if (response.success) {
        setJob(response.job);
        setHasApplied(response.hasApplied);
      }
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const response = await studentApi.applyForJob(params.id as string, { coverLetter });
      if (response.success) {
        setHasApplied(true);
        setShowApplyModal(false);
        setCoverLetter('');
        alert('Application submitted successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#2F4156]" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <p className="text-red-800">{error || 'Job not found'}</p>
            <Link href="/student/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to Jobs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/student/jobs" className="mb-6 inline-flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156]">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="rounded-2xl border border-[#C8D9E6] bg-white p-8 shadow-sm">
          {/* Company Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex gap-4">
              {job.Company.logo && (
                <img src={job.Company.logo} alt={job.Company.companyName} className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-[#2F4156]">{job.title}</h1>
                <p className="mt-1 text-lg text-[#567C8D]">{job.Company.companyName}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                    {job.workMode}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>
            {hasApplied ? (
              <div className="rounded-xl bg-emerald-100 px-6 py-3 text-center">
                <CheckCircle2 className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">Applied</p>
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="rounded-xl bg-[#2F4156] px-8 py-3 font-medium text-white transition hover:bg-[#243447]"
              >
                Apply Now
              </button>
            )}
          </div>

          {/* Job Details Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4">
            {job.salaryRange && (
              <div>
                <div className="flex items-center gap-2 text-sm text-[#567C8D]">
                  <DollarSign className="h-4 w-4" />
                  Salary
                </div>
                <div className="mt-1 font-medium text-[#2F4156]">{job.salaryRange}</div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-sm text-[#567C8D]">
                <Briefcase className="h-4 w-4" />
                Experience
              </div>
              <div className="mt-1 font-medium text-[#2F4156]">{job.experienceLevel} level</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-[#567C8D]">
                <Users className="h-4 w-4" />
                Positions
              </div>
              <div className="mt-1 font-medium text-[#2F4156]">{job.numberOfPositions}</div>
            </div>
            {job.deadline && (
              <div>
                <div className="flex items-center gap-2 text-sm text-[#567C8D]">
                  <Calendar className="h-4 w-4" />
                  Deadline
                </div>
                <div className="mt-1 font-medium text-[#2F4156]">
                  {new Date(job.deadline).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold text-[#2F4156]">Job Description</h2>
            <p className="whitespace-pre-wrap text-[#567C8D]">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-bold text-[#2F4156]">Responsibilities</h2>
              <p className="whitespace-pre-wrap text-[#567C8D]">{job.responsibilities}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-bold text-[#2F4156]">Requirements</h2>
              <p className="whitespace-pre-wrap text-[#567C8D]">{job.requirements}</p>
            </div>
          )}

          {/* Skills Required */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-bold text-[#2F4156]">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span key={index} className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="border-t pt-6">
            <h2 className="mb-3 text-xl font-bold text-[#2F4156]">About {job.Company.companyName}</h2>
            <p className="mb-4 text-[#567C8D]">{job.Company.description || 'No description available'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-[#567C8D]">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.Company.industry}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.Company.location}
              </span>
              {job.Company.website && (
                <a
                  href={job.Company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-2xl font-bold text-[#2F4156]">Apply for {job.title}</h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the company why you're interested in this position..."
                className="w-full rounded-lg border border-[#C8D9E6] p-3 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                rows={6}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 rounded-xl bg-[#2F4156] px-6 py-3 font-medium text-white transition hover:bg-[#243447] disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-xl bg-white px-6 py-3 font-medium text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
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
