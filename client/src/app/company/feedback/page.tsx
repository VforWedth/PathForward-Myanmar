// app/company/feedback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

import { AppSidebar } from '@/components/ui/company/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { MessageSquare, PlusCircle } from 'lucide-react';

interface StudentFeedback {
  id: string;
  studentId: string;
  studentName: string;
  position: string;
  rating: number;
  feedback: string;
  submittedDate: string;
  interviewPerformance: string;
  technicalSkills: string;
  communication: string;
  strengths: string;
  areasForImprovement: string;
}

interface FeedbackForm {
  studentId: string;
  studentName: string;
  position: string;
  rating: number;
  feedback: string;
  interviewPerformance: string;
  technicalSkills: string;
  communication: string;
  strengths: string;
  areasForImprovement: string;
}

export default function CompanyFeedback() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FeedbackForm>({
    studentId: '',
    studentName: '',
    position: '',
    rating: 0,
    feedback: '',
    interviewPerformance: '',
    technicalSkills: '',
    communication: '',
    strengths: '',
    areasForImprovement: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    // Mock data - replace with API call
    const mockFeedbacks: StudentFeedback[] = [
      {
        id: '1',
        studentId: 's1',
        studentName: 'Aung Aung',
        position: 'Frontend Intern',
        rating: 4,
        feedback:
          'Excellent problem-solving skills and quick learner. Showed great initiative in projects.',
        submittedDate: '2024-01-10',
        interviewPerformance: 'Confident and articulate with clear communication',
        technicalSkills:
          'Strong React knowledge, good understanding of modern JavaScript',
        communication:
          'Clear and effective communicator, good at explaining technical concepts',
        strengths: 'Fast learner, proactive, good team player',
        areasForImprovement: 'Could benefit from more experience with state management',
      },
      {
        id: '2',
        studentId: 's2',
        studentName: 'Mi Mi',
        position: 'Backend Developer',
        rating: 5,
        feedback: 'Outstanding technical skills and professional attitude.',
        submittedDate: '2024-01-08',
        interviewPerformance: 'Very professional and well-prepared',
        technicalSkills: 'Expert in Node.js and database design',
        communication:
          'Excellent communication skills, both technical and non-technical',
        strengths: 'Strong technical foundation, reliable, great problem-solver',
        areasForImprovement: 'None noted',
      },
    ];

    setFeedbacks(mockFeedbacks);
    setIsLoading(false);
  }, [user, router]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    const newFeedback: StudentFeedback = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      studentName: formData.studentName,
      position: formData.position,
      rating: formData.rating,
      feedback: formData.feedback,
      submittedDate: new Date().toISOString().split('T')[0],
      interviewPerformance: formData.interviewPerformance,
      technicalSkills: formData.technicalSkills,
      communication: formData.communication,
      strengths: formData.strengths,
      areasForImprovement: formData.areasForImprovement,
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    toast.success('Feedback submitted successfully!');
    setShowFeedbackForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      position: '',
      rating: 0,
      feedback: '',
      interviewPerformance: '',
      technicalSkills: '',
      communication: '',
      strengths: '',
      areasForImprovement: '',
    });
  };

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${
              onRatingChange
                ? 'cursor-pointer hover:text-yellow-300 transition-colors'
                : ''
            }`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-700 bg-green-100';
    if (rating >= 3) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading feedback...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* THEMED GRADIENT HEADER with SidebarTrigger on LEFT */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            {/* LEFT: sidebar trigger + title */}
            <div className="flex items-center gap-3">
             
              <MessageSquare className="h-6 w-6" />
              <span className="text-base font-semibold leading-none sm:text-lg">
                Feedback
              </span>
            </div>

            {/* RIGHT: quick actions (desktop) */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm hover:bg-[#F5EFEB]"
              >
                <PlusCircle className="h-4 w-4" /> Add Feedback
              </button>
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* breadcrumb row */}
          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
               <SidebarTrigger
                className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
                aria-label="Toggle sidebar"
              />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">
                    Company
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feedback</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* mobile trigger */}
            <div className="ml-auto md:hidden">
              <SidebarTrigger className="text-white" aria-label="Toggle sidebar" />
            </div>
          </div>
        </header>

        {/* THEMED BODY */}
        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            {/* Feedback Form Modal (themed) */}
            {showFeedbackForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[#2F4156]">Provide Student Feedback</h3>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false);
                        resetForm();
                      }}
                      className="rounded-md p-1 text-[#567C8D] hover:bg-[#F5EFEB]"
                      aria-label="Close"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmitFeedback} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Student Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Position/Role *</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Overall Rating *</label>
                      <div className="flex items-center gap-4">
                        <StarRating
                          rating={formData.rating}
                          onRatingChange={(rating) => setFormData({ ...formData, rating })}
                        />
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getRatingColor(formData.rating)}`}>
                          {formData.rating > 0 ? `${formData.rating}/5` : 'Not rated'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Interview Performance</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          placeholder="How did the student perform during the interview?"
                          value={formData.interviewPerformance}
                          onChange={(e) => setFormData({ ...formData, interviewPerformance: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Technical Skills</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          placeholder="Evaluate technical skills and knowledge..."
                          value={formData.technicalSkills}
                          onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Communication</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          placeholder="How were their communication skills?"
                          value={formData.communication}
                          onChange={(e) => setFormData({ ...formData, communication: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Key Strengths</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          placeholder="What are their main strengths?"
                          value={formData.strengths}
                          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Areas for Improvement</label>
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        placeholder="What could they improve on?"
                        value={formData.areasForImprovement}
                        onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Overall Feedback *</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        placeholder="Provide comprehensive feedback about the student..."
                        value={formData.feedback}
                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-[#2F4156] px-4 py-2 text-white transition hover:bg-[#243447]"
                      >
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFeedbackForm(false);
                          resetForm();
                        }}
                        className="rounded-lg border border-[#C8D9E6] px-4 py-2 text-[#2F4156] hover:bg-[#F5EFEB]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Stats (themed) */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 text-center shadow-sm">
                <div className="mb-1 text-3xl font-bold text-[#2F4156]">{feedbacks.length}</div>
                <div className="text-sm text-[#567C8D]">Total Feedback</div>
              </div>
              <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 text-center shadow-sm">
                <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                  {feedbacks.filter((f) => f.rating >= 4).length}
                </div>
                <div className="text-sm text-[#567C8D]">Positive Reviews</div>
              </div>
              <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 text-center shadow-sm">
                <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                  {feedbacks.filter((f) => f.rating === 3).length}
                </div>
                <div className="text-sm text-[#567C8D]">Average Reviews</div>
              </div>
              <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 text-center shadow-sm">
                <div className="mb-1 text-3xl font-bold text-[#2F4156]">
                  {feedbacks.filter((f) => f.rating <= 2).length}
                </div>
                <div className="text-sm text-[#567C8D]">Needs Improvement</div>
              </div>
            </div>

            {/* Feedback List (themed) */}
            <div className="rounded-2xl border border-[#C8D9E6] bg-white shadow-sm">
              <div className="border-b border-[#E3EAF1] p-6">
                <div className="mb-1 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#2F4156]" />
                  <h3 className="text-lg font-semibold text-[#2F4156]">Student Feedback History</h3>
                </div>
                <p className="text-sm text-[#567C8D]">Manage and view all student feedback</p>
              </div>

              <div className="divide-y divide-[#E3EAF1]">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-6 transition hover:bg-[#F5EFEB]/50">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-[#2F4156]">{feedback.studentName}</h4>
                        <p className="text-[#567C8D]">{feedback.position}</p>
                        <p className="text-sm text-[#567C8D]/80">Submitted on {feedback.submittedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={feedback.rating} />
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                          {feedback.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Interview Performance</h5>
                        <p className="text-sm text-[#567C8D]">{feedback.interviewPerformance}</p>
                      </div>
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Technical Skills</h5>
                        <p className="text-sm text-[#567C8D]">{feedback.technicalSkills}</p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Communication</h5>
                        <p className="text-sm text-[#567C8D]">{feedback.communication}</p>
                      </div>
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Strengths</h5>
                        <p className="text-sm text-[#567C8D]">{feedback.strengths}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Areas for Improvement</h5>
                      <p className="text-sm text-[#567C8D]">{feedback.areasForImprovement}</p>
                    </div>

                    <div>
                      <h5 className="mb-2 text-sm font-semibold text-[#2F4156]">Overall Feedback</h5>
                      <p className="text-[#2F4156]">{feedback.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>

              {feedbacks.length === 0 && (
                <div className="p-12 text-center text-[#567C8D]">
                  <svg className="mx-auto mb-4 h-20 w-20 text-[#C8D9E6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mb-2 text-lg text-[#2F4156]">No feedback submitted yet</p>
                  <p className="mb-4 text-sm">Start providing feedback to help students improve</p>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="rounded-lg bg-[#2F4156] px-4 py-2 text-white hover:bg-[#243447]"
                  >
                    Add Your First Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
