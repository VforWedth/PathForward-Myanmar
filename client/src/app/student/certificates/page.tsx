'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Award, Calendar, Download, ExternalLink, ChevronRight, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentTopNav } from '@/components/ui/student/top-nav';

interface Certificate {
  id: string;
  quizId: string;
  score: number;
  earnedPoints: number;
  totalPoints: number;
  certificateUrl: string;
  completedAt: string;
  Quiz: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    passingScore: number;
  };
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 ring-green-600/20',
  intermediate: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
  advanced: 'bg-red-100 text-red-700 ring-red-600/20',
};

export default function CertificatesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchCertificates();
  }, [user, router]);

  const fetchCertificates = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      const token = localStorage.getItem('token');

      console.log('Fetching certificates from:', `${API_BASE_URL}/api/student/certificates`);

      const response = await fetch(`${API_BASE_URL}/api/student/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Certificates response status:', response.status);
      const data = await response.json();
      console.log('Certificates data:', data);

      if (data.success) {
        setCertificates(data.data);
      } else {
        console.error('Failed to fetch certificates:', data.message);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // This would generate/download the certificate
    // For now, we'll show an alert
    alert(`Certificate download functionality will be implemented. Certificate ID: ${certificate.id}`);
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
            <span className="text-[#2F4156]">Certificates</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2F4156]">My Certificates</h1>
          <p className="mt-2 text-[#567C8D]">
            View and download your earned certificates. Share them with employers to showcase your expertise!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#C8D9E6] bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Total Certificates</div>
                <div className="text-3xl font-bold text-[#2F4156]">{certificates.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#C8D9E6] bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Unique Categories</div>
                <div className="text-3xl font-bold text-[#2F4156]">
                  {new Set(certificates.map((c) => c.Quiz.category)).size}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#C8D9E6] bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-[#567C8D]">Average Score</div>
                <div className="text-3xl font-bold text-[#2F4156]">
                  {certificates.length > 0
                    ? Math.round(
                        certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-[#567C8D]">Loading certificates...</p>
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate, idx) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <div className="group h-full rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition hover:shadow-lg">
                  {/* Header with Award Icon */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-emerald-100 p-3">
                      <Award className="h-8 w-8 text-emerald-600" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                        difficultyColors[certificate.Quiz.difficulty as keyof typeof difficultyColors]
                      }`}
                    >
                      {certificate.Quiz.difficulty}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-600/20">
                      {certificate.Quiz.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-[#2F4156] line-clamp-2">
                    {certificate.Quiz.title}
                  </h3>

                  {/* Score Display */}
                  <div className="mb-4 flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-bold text-emerald-600">{certificate.score}%</div>
                      <div className="text-xs text-[#567C8D]">Final Score</div>
                    </div>
                    <div className="h-12 w-px bg-[#C8D9E6]"></div>
                    <div>
                      <div className="text-lg font-semibold text-[#2F4156]">
                        {certificate.earnedPoints}/{certificate.totalPoints}
                      </div>
                      <div className="text-xs text-[#567C8D]">Points Earned</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-[#567C8D]">
                    <Calendar className="h-4 w-4" />
                    <span>Earned {new Date(certificate.completedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadCertificate(certificate)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <Link
                      href={`/student/quiz/result/${certificate.id}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#C8D9E6] bg-white px-4 py-2.5 text-sm font-medium text-[#2F4156] transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-[#C8D9E6] bg-white/60 p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Award className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-[#2F4156]">No Certificates Yet</h3>
            <p className="mb-6 text-[#567C8D]">
              Take skills tests and score 85% or higher to earn certificates!
            </p>
            <Link
              href="/student/skills-test"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <BookOpen className="h-5 w-5" />
              Take Skills Test
            </Link>
          </div>
        )}

        {/* CTA Section */}
        {certificates.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[#C8D9E6] bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-[#2F4156]">Want to Earn More Certificates?</h3>
            <p className="mb-6 text-[#567C8D]">
              Take more skills assessments to expand your expertise and stand out to employers.
            </p>
            <Link
              href="/student/skills-test"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <BookOpen className="h-5 w-5" />
              Browse Available Tests
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
