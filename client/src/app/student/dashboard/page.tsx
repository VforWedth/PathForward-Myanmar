'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, User2, Compass, Sparkles, Award, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentTopNav } from '@/components/ui/student/top-nav';

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
        console.log('Dashboard data:', data); // Debug log
        
        if (data.success) {
          setStats(data.data.stats);
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

    fetchDashboard();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

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
                {user?.name ? `Hi, ${user.name} 👋` : 'Welcome 👋'}
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

        {/* Skills Test Section */}
        <section className="mt-10">
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
                
                <div className="mb-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-[#E3EAF1]">
                    <Award className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-[#2F4156]">{stats.certificates}</div>
                      <div className="text-xs text-[#567C8D]">Certificates</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-[#E3EAF1]">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-medium text-[#2F4156]">{stats.quizzesTaken}</div>
                      <div className="text-xs text-[#567C8D]">Tests Taken</div>
                    </div>
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

              {/* Recent Certificates */}
              {certificates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#2F4156]">Recent Certificates</h4>
                  {certificates.slice(0, 2).map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-[#E3EAF1]"
                    >
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#2F4156]">{cert.Quiz.category}</div>
                        <div className="text-xs text-[#567C8D]">{cert.score}% • {cert.Quiz.difficulty}</div>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/student/certificates"
                    className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Activity & Announcements */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#2F4156]" />
                <h4 className="text-lg font-semibold text-[#2F4156]">Recent activity</h4>
              </div>
              <ol className="relative ml-3 border-l border-[#E3EAF1] pl-6">
                {[
                  {
                    title: 'Uploaded CV',
                    time: 'Today · 4:15 PM',
                    desc: 'Your CV is now visible to recruiters.',
                  },
                  {
                    title: 'Applied to UI/UX Intern · Nebula Labs',
                    time: 'Yesterday · 10:05 AM',
                    desc: 'Status: Under review',
                  },
                  {
                    title: 'New review from Bright Hill International',
                    time: 'Oct 10 · 8:30 PM',
                    desc: '"Great communication and eagerness to learn."',
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6 last:mb-0">
                    <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#2F4156]">{item.title}</p>
                        <span className="text-xs text-[#567C8D]">{item.time}</span>
                      </div>
                      <p className="text-sm text-[#567C8D]">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4">
                <Link
                  href="/student/notifications"
                  className="text-sm font-medium text-[#2F4156] underline underline-offset-4 hover:text-[#243447]"
                >
                  View all activity
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold text-[#2F4156]">This week's tips</h4>
              <ul className="list-disc space-y-2 pl-5 text-sm text-[#567C8D]">
                <li>Tailor your CV for each role—mirror keywords from the job post.</li>
                <li>Ask for feedback after interviews to grow faster.</li>
                <li>Keep your LinkedIn headline clear and outcome-focused.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#C8D9E6] bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-600/10">
              <h4 className="mb-1 text-lg font-semibold text-[#2F4156]">Need guidance?</h4>
              <p className="text-sm text-[#2F4156]/80">
                Try the career compass to discover roles that match your skills.
              </p>
              <Link
                href="/student/compass"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-3 py-2 text-white shadow-sm transition hover:translate-y-[-1px]"
              >
                <Compass className="h-4 w-4" /> Open Career Compass
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-12 max-w-7xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Built with ♥ for learners — PathForward Myanmar
      </footer>
    </div>
  );
}