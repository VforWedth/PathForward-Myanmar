'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, User2, Compass, Sparkles, Award, Target, TrendingUp, Building2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentTopNav } from '@/components/ui/student/top-nav';
import * as studentApi from '@/lib/studentApi';
import { FAQSection } from '@/components/faq/FAQSection';
import { getFAQsByCategory, getGeneralFAQs } from '@/components/faq/FAQData';

interface DashboardStats {
  applications: number;
  interviews: number;
  offers: number;
  quizzesTaken: number;
  certificates: number;
}

interface Certificate {
  id: string;
  score: number;
  completedAt: string;
  Quiz: {
    title: string;
    category: string;
    difficulty: string;
  };
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  universityId?: string;
  rollNumber?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  University?: {
    id: string;
    universityName: string;
    location: string;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    applications: 0,
    interviews: 0,
    offers: 0,
    quizzesTaken: 0,
    certificates: 0,
  });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const API_BASE_URL = 'http://localhost:5000';
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/api/student/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Dashboard API Response:', data);
        console.log('Stats from API:', data.data?.stats);
        console.log('Certificates from API:', data.data?.recentCertificates);

        if (data.success) {
          const statsData = data.data.stats;
          console.log('Setting stats:', statsData);
          setStats(statsData);
          setCertificates(data.data.recentCertificates || []);
        } else {
          console.error('Failed to fetch dashboard:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await studentApi.getProfile();
        if (response.success) {
          console.log('=== PROFILE DEBUG ===');
          console.log('Full profile data:', response.data);
          console.log('universityId:', response.data.universityId);
          console.log('universityId type:', typeof response.data.universityId);
          console.log('universityId is null:', response.data.universityId === null);
          console.log('universityId is undefined:', response.data.universityId === undefined);
          console.log('verificationStatus:', response.data.verificationStatus);
          console.log('University object:', response.data.University);
          console.log('rollNumber:', response.data.rollNumber);
          console.log('====================');
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchDashboard();
    fetchProfile();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav
        userName={user?.name}
        firstName={profile?.firstName}
        lastName={profile?.lastName}
        alertsCount={3}
        onLogout={logout}
      />

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_0%_-10%,rgba(16,44,36,0.08),transparent),radial-gradient(800px_200px_at_100%_120%,rgba(86,124,141,0.08),transparent)]" />
          <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                <Sparkles className="h-4 w-4" /> Welcome back
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#2F4156] md:text-3xl">
                {profile ? `Hi, ${profile.firstName} ${profile.lastName} 👋` : user?.name ? `Hi, ${user.name} 👋` : user?.email ? `Hi, ${user.email.split('@')[0]} 👋` : 'Welcome 👋'}
              </h2>
              <p className="mt-2 max-w-prose text-[#567C8D]">
                Let's keep your career journey moving. Start by updating your profile, checking applications, or taking a skills test.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/student/applications"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-4 py-2 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447]"
                >
                  <FileText className="h-5 w-5" />
                  View applications
                </Link>
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                >
                  <User2 className="h-5 w-5" />
                  Update profile
                </Link>
                <Link
                  href="/student/findpeer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                >
                  <User2 className="h-5 w-5" />
                  Find Peer
                </Link>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              {[
                { label: 'Applications', value: stats.applications },
                { label: 'Interviews', value: stats.interviews },
                { label: 'Offers', value: stats.offers },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#E3EAF1] bg-white/90 p-4 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#2F4156]">{s.value}</div>
                  <div className="text-xs text-[#567C8D]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* University Verification Section */}
        <section className="mt-10">
          {!profile?.universityId || profile?.verificationStatus === 'pending' || profile?.verificationStatus === 'rejected' ? (
            <div className={`rounded-2xl border p-6 shadow-sm ${
              profile?.verificationStatus === 'pending'
                ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
                : profile?.verificationStatus === 'rejected'
                ? 'border-red-200 bg-gradient-to-br from-red-50 to-white'
                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-lg p-2 ${
                  profile?.verificationStatus === 'pending'
                    ? 'bg-amber-100'
                    : profile?.verificationStatus === 'rejected'
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}>
                  {profile?.verificationStatus === 'pending' ? (
                    <Clock className="h-6 w-6 text-amber-600" />
                  ) : profile?.verificationStatus === 'rejected' ? (
                    <XCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <Building2 className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2F4156]">
                    {profile?.verificationStatus === 'pending'
                      ? 'Verification Pending'
                      : profile?.verificationStatus === 'rejected'
                      ? 'Verification Rejected'
                      : 'Verify Your University'}
                  </h3>
                  <p className="text-sm text-[#567C8D]">
                    {profile?.verificationStatus === 'pending'
                      ? 'Your request is being reviewed by your university'
                      : profile?.verificationStatus === 'rejected'
                      ? 'Your verification was rejected. Please resubmit with correct information.'
                      : 'Get verified to unlock exclusive opportunities'}
                  </p>
                </div>
              </div>
              <p className="text-[#567C8D] mb-4">
                {profile?.verificationStatus === 'pending'
                  ? 'You will receive a notification once your university approves your verification request. This usually takes 1-2 business days.'
                  : profile?.verificationStatus === 'rejected'
                  ? `Reason: ${profile?.rejectionReason || 'Please contact your university for more information.'}`
                  : 'Connect with your university to access job postings, internships, and career resources exclusively for verified students.'}
              </p>
              {profile?.verificationStatus !== 'pending' && (
                <Link
                  href="/student/verify-university"
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-sm transition hover:translate-y-[-1px] ${
                    profile?.verificationStatus === 'rejected'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#2F4156] hover:bg-[#243447]'
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                  {profile?.verificationStatus === 'rejected' ? 'Resubmit Verification' : 'Verify Your University'}
                </Link>
              )}
            </div>
          ) : profile?.verificationStatus === 'approved' && profile?.University ? (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2F4156]">Verified Student</h3>
                    <p className="text-sm text-[#567C8D]">
                      {profile.University.universityName} • {profile.University.location}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </div>
              </div>
              <p className="mt-4 text-[#567C8D]">
                You now have access to exclusive opportunities from companies partnered with your university.
              </p>
            </div>
          ) : null}
        </section>

        {/* Browse Jobs Section */}
        <section className="mt-10">
          <div className="rounded-2xl border border-[#C8D9E6] bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Compass className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#2F4156]">Ready to Explore?</h3>
            </div>
            <p className="mb-4 text-[#567C8D]">
              {profile?.verificationStatus === 'approved'
                ? 'Browse exclusive job opportunities from companies partnered with your university.'
                : 'Verify your university account to access exclusive job opportunities.'}
            </p>
            <Link
              href={profile?.verificationStatus === 'approved' ? '/student/jobs' : '/student/verify-university'}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-purple-700"
            >
              <Compass className="h-5 w-5" />
              {profile?.verificationStatus === 'approved' ? 'Browse Jobs' : 'Get Verified'}
            </Link>
          </div>
        </section>

        {/* Skills Test Section */}
        <section className="mt-6">
          <div className="rounded-2xl border border-[#C8D9E6] bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-[#2F4156]">Validate Your Skills</h3>
                </div>
                <p className="mb-4 text-[#567C8D]">
                  Take our skills assessments to earn certificates and showcase your expertise to employers.
                  Score 85% or higher to unlock your certificate!
                </p>

                <div className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-[#E3EAF1] w-fit">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-[#2F4156]">{stats.quizzesTaken}</div>
                    <div className="text-xs text-[#567C8D]">Tests Taken</div>
                  </div>
                </div>

                <Link
                  href="/student/skills-test"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-blue-700"
                >
                  <Target className="h-5 w-5" />
                  Take Skills Test
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section className="mt-6">
          <div className="rounded-2xl border border-[#C8D9E6] bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Award className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-[#2F4156]">My Certificates</h3>
                </div>
                <p className="mb-4 text-[#567C8D]">
                  View and download your earned certificates. Share them with employers to showcase your expertise!
                </p>

                <div className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-[#E3EAF1] w-fit">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-[#2F4156]">{stats.certificates}</div>
                    <div className="text-xs text-[#567C8D]">Certificates Earned</div>
                  </div>
                </div>

                <Link
                  href="/student/certificates"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:translate-y-[-1px] hover:bg-emerald-700"
                >
                  <Award className="h-5 w-5" />
                  View Certificates
                </Link>
              </div>

              {/* Recent Certificates */}
              {certificates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#2F4156]">Recent Certificates</h4>
                  {certificates.slice(0, 2).map((cert) => (
                    <Link
                      key={cert.id}
                      href={`/student/quiz/result/${cert.id}`}
                      className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-[#E3EAF1] transition hover:bg-emerald-50 hover:ring-emerald-200"
                    >
                      <div className="rounded-lg bg-emerald-100 p-2">
                        <Award className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#2F4156]">{cert.Quiz.category}</div>
                        <div className="text-xs text-[#567C8D]">{cert.score}% • {cert.Quiz.difficulty}</div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/student/certificates"
                    className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View all certificates →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-6">
          <FAQSection
            faqs={[...getFAQsByCategory('students'), ...getGeneralFAQs()]}
            title="Student Help & FAQ"
          />
        </section>
      </main>

      <footer className="mx-auto mt-12 max-w-7xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Built with ♥ for learners — PathForward Myanmar
      </footer>
    </div>
  );
}