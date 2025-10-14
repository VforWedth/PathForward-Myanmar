'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FileText, User2, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentTopNav } from '@/components/ui/student/top-nav'; // <-- shadcn top nav

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      {/* Top Nav (shadcn) */}
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      {/* Page container */}
      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Welcome / Hero */}
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
                Let’s keep your career journey moving. Start by updating your profile, checking applications, or reading peer reviews.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/student/applications"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-4 py-2 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <FileText className="h-5 w-5" />
                  View applications
                </Link>
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <User2 className="h-5 w-5" />
                  Update profile
                </Link>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              {[
                { label: 'Applications', value: 6 },
                { label: 'Interviews', value: 2 },
                { label: 'Offers', value: 1 },
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

        {/* Activity & Announcements */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Activity timeline */}
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
                    desc: '“Great communication and eagerness to learn.”',
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

          {/* Announcements / Tips */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold text-[#2F4156]">This week’s tips</h4>
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

        {/* Empty state demo block (hide if you already have data) */}
        <section className="mt-10">
          <div className="rounded-2xl border border-dashed border-[#C8D9E6] bg-white/60 p-6 text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2F4156] ring-1 ring-[#E3EAF1]">
              <Sparkles className="h-4 w-4" /> Coming soon
            </p>
            <h5 className="mt-3 text-lg font-semibold text-[#2F4156]">Personalized analytics</h5>
            <p className="mx-auto mt-1 max-w-prose text-sm text-[#567C8D]">
              See your application funnel, interview conversion, and salary insights—tailored just for you.
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-12 max-w-7xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Built with ♥ for learners — PathForward Myanmar
      </footer>
    </div>
  );
}
