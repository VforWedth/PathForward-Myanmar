'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Award, Clock, Target, TrendingUp, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentTopNav } from '@/components/ui/student/top-nav';
import { getQuizzes } from '@/lib/quizApi';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  passingScore: number;
  totalQuestions: number;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 ring-green-600/20',
  intermediate: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
  advanced: 'bg-red-100 text-red-700 ring-red-600/20',
};

export default function SkillsTestPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchQuizzes();
  }, [user, router]);

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      
      if (response.success) {
        setQuizzes(response.data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#567C8D]">
            <Link href="/student/dashboard" className="hover:text-[#2F4156]">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#2F4156]">Skills Test</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2F4156]">Validate Your Skills</h1>
          <p className="mt-2 text-[#567C8D]">
            Take assessments to earn certificates and showcase your expertise. Score 85% or higher to unlock your certificate!
          </p>
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#C8D9E6] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Passing Score</div>
                <div className="text-lg font-bold text-[#2F4156]">70%</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#C8D9E6] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Certificate at</div>
                <div className="text-lg font-bold text-[#2F4156]">85%+</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#C8D9E6] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Available Tests</div>
                <div className="text-lg font-bold text-[#2F4156]">{quizzes.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-[#567C8D]">Loading quizzes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz, idx) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <div className="group h-full rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm transition hover:shadow-md">
                  {/* Category Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-600/20">
                      {quiz.category}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${difficultyColors[quiz.difficulty]}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-2 text-xl font-bold text-[#2F4156] group-hover:text-blue-600 transition">
                    {quiz.title}
                  </h3>
                  <p className="mb-4 text-sm text-[#567C8D] line-clamp-2">{quiz.description}</p>

                  {/* Meta Info */}
                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-[#567C8D]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{quiz.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{quiz.passingScore}% to pass</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/student/quiz/${quiz.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
                  >
                    Start Test
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && quizzes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#C8D9E6] bg-white/60 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#2F4156]">No quizzes available</h3>
            <p className="text-sm text-[#567C8D]">Check back later for new skills assessments!</p>
          </div>
        )}

        {/* View My Attempts */}
        <div className="mt-8 text-center">
          <Link
            href="/student/quiz/attempts"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View My Attempts & Scores
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}