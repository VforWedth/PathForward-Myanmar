'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { StudentTopNav } from '@/components/ui/student/top-nav';
import * as studentApi from '@/lib/studentApi';

interface University {
  id: string;
  universityName: string;
  location: string;
  logo?: string;
}

export default function VerifyUniversityPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch universities
        const universitiesResponse = await studentApi.getUniversities();
        if (universitiesResponse.success) {
          setUniversities(universitiesResponse.data);
        }

        // Fetch existing profile to pre-fill form
        const profileResponse = await studentApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setExistingProfile(profileResponse.data);
          if (profileResponse.data.universityId) {
            setSelectedUniversityId(profileResponse.data.universityId);
          }
          if (profileResponse.data.rollNumber) {
            setRollNumber(profileResponse.data.rollNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUniversityId || !rollNumber.trim()) {
      alert('Please select a university and enter your roll number');
      return;
    }

    setSubmitting(true);
    try {
      const response = await studentApi.submitVerificationRequest({
        universityId: selectedUniversityId,
        rollNumber: rollNumber.trim(),
      });

      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />
        <main className="relative mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-3">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#2F4156]">
              Verification Request Submitted!
            </h2>
            <p className="text-[#567C8D]">
              Your university will review your request. You'll be notified once it's approved.
            </p>
            <p className="mt-4 text-sm text-[#567C8D]">Redirecting to dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={0} onLogout={logout} />

      <main className="relative mx-auto max-w-2xl px-6 py-8">
        <Link
          href="/student/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-[#C8D9E6] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2F4156]">Verify Your University</h1>
              <p className="text-sm text-[#567C8D]">
                Connect with your university to unlock exclusive opportunities
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-[#567C8D]">Loading universities...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {existingProfile?.verificationStatus === 'rejected' && existingProfile?.rejectionReason && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">Previous Rejection Reason:</h4>
                  <p className="text-sm text-red-700">{existingProfile.rejectionReason}</p>
                  <p className="text-xs text-red-600 mt-2">Please correct the information below and resubmit.</p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                  Select Your University <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUniversityId}
                  onChange={(e) => setSelectedUniversityId(e.target.value)}
                  className="w-full rounded-lg border border-[#C8D9E6] px-4 py-3 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                >
                  <option value="">Choose your university...</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.universityName} - {uni.location}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#567C8D]">
                  Select the university where you are currently enrolled
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F4156]">
                  Roll Number / Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number or student ID"
                  className="w-full rounded-lg border border-[#C8D9E6] px-4 py-3 text-[#2F4156] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <p className="mt-1 text-xs text-[#567C8D]">
                  Enter your official roll number as provided by your university
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-[#2F4156]">What happens next?</h3>
                <ul className="space-y-1 text-sm text-[#567C8D]">
                  <li>• Your university will review your verification request</li>
                  <li>• You'll receive a notification once verified</li>
                  <li>• Verified students get access to exclusive opportunities</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#2F4156] px-6 py-3 font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-[#243447] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Verify'}
                </button>
                <Link
                  href="/student/dashboard"
                  className="rounded-xl bg-white px-6 py-3 font-medium text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
