'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Award, CheckCircle2, XCircle, ChevronRight, Download, Home } from 'lucide-react';
import { StudentTopNav } from '@/components/ui/student/top-nav';

interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
  explanation: string;
}

interface AttemptData {
  id: string;
  score: number;
  earnedPoints: number;
  totalPoints: number;
  passed: boolean;
  certificateIssued: boolean;
  certificateUrl: string | null;
  completedAt: string;
  answers: Answer[];
  Quiz: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    passingScore: number;
  };
}

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuthStore();
  const attemptId = params.id as string;

  const [attemptData, setAttemptData] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchAttemptData();
  }, [user, router, attemptId]);

  const fetchAttemptData = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      const token = localStorage.getItem('token');

      console.log('Fetching quiz attempt:', attemptId);

      const response = await fetch(`${API_BASE_URL}/api/quizzes/attempts/${attemptId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Attempt response status:', response.status);
      const data = await response.json();
      console.log('Attempt data:', data);

      if (data.success) {
        setAttemptData(data.data);
      } else {
        console.error('Failed to fetch attempt:', data.message);
        alert(`Error loading results: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching attempt:', error);
      alert('Failed to load quiz results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFEB]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-[#567C8D]">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attemptData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFEB]">
        <div className="text-center">
          <p className="text-[#2F4156]">Results not found</p>
        </div>
      </div>
    );
  }

  const correctAnswers = attemptData.answers.filter((a) => a.isCorrect).length;
  const totalQuestions = attemptData.answers.length;

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      <main className="relative mx-auto max-w-4xl px-6 py-8">
        {/* Results Card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white shadow-lg">
          {/* Header Banner */}
          <div
            className={`p-8 text-center ${
              attemptData.certificateIssued
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                : attemptData.passed
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}
          >
            {attemptData.certificateIssued ? (
              <Award className="mx-auto mb-4 h-16 w-16 text-white" />
            ) : attemptData.passed ? (
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-white" />
            ) : (
              <XCircle className="mx-auto mb-4 h-16 w-16 text-white" />
            )}

            <h1 className="mb-2 text-3xl font-bold text-white">
              {attemptData.certificateIssued
                ? '🎉 Certificate Earned!'
                : attemptData.passed
                ? 'Quiz Passed!'
                : 'Keep Trying!'}
            </h1>
            <p className="text-white/90">
              {attemptData.certificateIssued
                ? 'Congratulations! You scored above 85% and earned a certificate.'
                : attemptData.passed
                ? 'You passed the quiz! Score 85% or higher to earn a certificate.'
                : 'You did not pass this time. Review the answers and try again!'}
            </p>
          </div>

          {/* Score Details */}
          <div className="grid grid-cols-2 gap-4 p-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-[#2F4156]">{attemptData.score}%</div>
              <div className="text-sm text-[#567C8D]">Score</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-[#567C8D]">Correct</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                {attemptData.earnedPoints}/{attemptData.totalPoints}
              </div>
              <div className="text-sm text-[#567C8D]">Points</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                {attemptData.Quiz.passingScore}%
              </div>
              <div className="text-sm text-[#567C8D]">Pass Mark</div>
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        {attemptData.certificateIssued && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-bold text-[#2F4156]">
                  {attemptData.Quiz.category} Certificate
                </h3>
                <p className="text-sm text-[#567C8D]">
                  Showcase this certificate on your profile and to employers
                </p>
              </div>
              <Link
                href="/student/certificates"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
              >
                <Download className="h-5 w-5" />
                View Certificate
              </Link>
            </div>
          </div>
        )}

        {/* Quiz Info */}
        <div className="mb-6 rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#2F4156]">Quiz Details</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <span className="text-sm text-[#567C8D]">Quiz Title:</span>
              <p className="font-medium text-[#2F4156]">{attemptData.Quiz.title}</p>
            </div>
            <div>
              <span className="text-sm text-[#567C8D]">Category:</span>
              <p className="font-medium text-[#2F4156]">{attemptData.Quiz.category}</p>
            </div>
            <div>
              <span className="text-sm text-[#567C8D]">Difficulty:</span>
              <p className="font-medium text-[#2F4156] capitalize">{attemptData.Quiz.difficulty}</p>
            </div>
            <div>
              <span className="text-sm text-[#567C8D]">Completed:</span>
              <p className="font-medium text-[#2F4156]">
                {new Date(attemptData.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Review Answers */}
        <div className="mb-6 rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-xl font-bold text-[#2F4156]">Review Answers</h2>
            <ChevronRight
              className={`h-6 w-6 transition-transform ${showAnswers ? 'rotate-90' : ''}`}
            />
          </button>

          {showAnswers && (
            <div className="mt-6 space-y-4">
              {attemptData.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border-2 p-4 ${
                    answer.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-[#2F4156]">Question {idx + 1}</h3>
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <p className="mb-3 text-sm text-[#567C8D]">{answer.explanation}</p>
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span className="font-medium text-[#2F4156]">Your Answer: </span>
                      <span className={answer.isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                        Option {parseInt(answer.answer) + 1}
                      </span>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <span className="font-medium text-[#2F4156]">Correct Answer: </span>
                        <span className="text-emerald-600">
                          Option {parseInt(answer.correctAnswer) + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-2 rounded-xl bg-[#2F4156] px-6 py-3 text-white transition hover:bg-[#243447]"
          >
            <Home className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <Link
            href="/student/skills-test"
            className="flex items-center gap-2 rounded-xl border border-[#C8D9E6] bg-white px-6 py-3 text-[#2F4156] transition hover:bg-gray-50"
          >
            Take Another Quiz
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}