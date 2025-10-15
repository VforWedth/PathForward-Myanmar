'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Clock, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentTopNav } from '@/components/ui/student/top-nav';

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  points: number;
  orderNumber: number;
}

interface Quiz {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
}

interface QuizData {
  quiz: Quiz;
  questions: Question[];
}

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuthStore();
  const quizId = params.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchQuizQuestions();
  }, [user, router, quizId]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuizQuestions = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      const token = localStorage.getItem('token');

      console.log('Fetching quiz questions for ID:', quizId);
      console.log('API URL:', `${API_BASE_URL}/api/quizzes/${quizId}/questions`);
      console.log('Has token:', !!token);

      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setQuizData(data.data);
        setTimeLeft(data.data.quiz.duration * 60); // Convert minutes to seconds
      } else {
        console.error('API returned success: false', data);
        alert(`Error: ${data.message || 'Failed to load quiz'}`);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const API_BASE_URL = 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const startTime = quizData ? quizData.quiz.duration * 60 : 0;
      const timeSpent = startTime - timeLeft;

      const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          timeSpent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to results page
        router.push(`/student/quiz/result/${data.data.attemptId}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = quizData
    ? ((Object.keys(answers).length / quizData.questions.length) * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFEB]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-[#567C8D]">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFEB]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-[#2F4156]">Quiz not found</p>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      <main className="relative mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156]"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-[#C8D9E6]">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-mono text-lg font-semibold text-[#2F4156]">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Quiz Title & Progress */}
        <div className="mb-6 rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-[#2F4156]">{quizData.quiz.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#567C8D]">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </p>
            <p className="text-sm text-[#567C8D]">{progress}% Complete</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-[#C8D9E6] bg-white p-8 shadow-sm">
          <div className="mb-6">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}
            </span>
          </div>

          <h2 className="mb-6 text-xl font-semibold text-[#2F4156]">{currentQ.questionText}</h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx.toString();
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(currentQ.id, idx.toString())}
                  className={`w-full rounded-xl border-2 p-4 text-left transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-[#C8D9E6] bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    <span className={isSelected ? 'font-medium text-[#2F4156]' : 'text-[#567C8D]'}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="rounded-xl border border-[#C8D9E6] bg-white px-6 py-2.5 text-[#2F4156] transition hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length === 0}
                className="rounded-xl bg-emerald-600 px-8 py-2.5 text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-white transition hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Answer Summary */}
        <div className="mt-6 rounded-xl border border-[#C8D9E6] bg-white p-4">
          <p className="mb-3 text-sm font-medium text-[#2F4156]">Answer Progress:</p>
          <div className="flex flex-wrap gap-2">
            {quizData.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                  answers[q.id]
                    ? 'bg-blue-600 text-white'
                    : currentQuestion === idx
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}