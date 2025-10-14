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

    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/feedback`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFeedbacks(data.data);
          }
        } else {
          console.error('Failed to fetch feedback');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [user, router]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Feedback submitted successfully!');
        setShowFeedbackForm(false);
        resetForm();

        // Refresh feedback list
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/feedback`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setFeedbacks(refreshData.data);
          }
        }
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
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
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading feedback...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Shared header — matches your dashboard */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feedback</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto pr-4">
              <div className="space-x-2">
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  + Add New Feedback
                </button>
                <button
                  onClick={() => router.push('/company/dashboard')}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto p-8 w-full">
            {/* Feedback Form Modal */}
            {showFeedbackForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Provide Student Feedback
                    </h3>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmitFeedback} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Student Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          value={formData.studentName}
                          onChange={(e) =>
                            setFormData({ ...formData, studentName: e.target.value })
                          }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Note: Student ID is optional. Feedback can be submitted without linking to a specific student.
                        </p>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">
                          Position/Role *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Overall Rating *
                      </label>
                      <div className="flex items-center space-x-4">
                        <StarRating
                          rating={formData.rating}
                          onRatingChange={(rating) =>
                            setFormData({ ...formData, rating })
                          }
                        />
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                            formData.rating
                          )}`}
                        >
                          {formData.rating > 0
                            ? `${formData.rating}/5`
                            : 'Not rated'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Interview Performance
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="How did the student perform during the interview?"
                          value={formData.interviewPerformance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              interviewPerformance: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">
                          Technical Skills
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Evaluate technical skills and knowledge..."
                          value={formData.technicalSkills}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              technicalSkills: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Communication Skills
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="How were their communication skills?"
                          value={formData.communication}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              communication: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">
                          Key Strengths
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="What are their main strengths?"
                          value={formData.strengths}
                          onChange={(e) =>
                            setFormData({ ...formData, strengths: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Areas for Improvement
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="What could they improve on?"
                        value={formData.areasForImprovement}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            areasForImprovement: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Overall Feedback *
                      </label>
                      <textarea
                        rows={4}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Provide comprehensive feedback about the student..."
                        value={formData.feedback}
                        onChange={(e) =>
                          setFormData({ ...formData, feedback: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFeedbackForm(false);
                          resetForm();
                        }}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Feedback Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {feedbacks.length}
                </div>
                <div className="text-gray-600">Total Feedback</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {feedbacks.filter((f) => f.rating >= 4).length}
                </div>
                <div className="text-gray-600">Positive Reviews</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {feedbacks.filter((f) => f.rating === 3).length}
                </div>
                <div className="text-gray-600">Average Reviews</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {feedbacks.filter((f) => f.rating <= 2).length}
                </div>
                <div className="text-gray-600">Needs Improvement</div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Student Feedback History</h3>
                <p className="text-gray-600">
                  Manage and view all student feedback
                </p>
              </div>

              <div className="divide-y">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {feedback.studentName}
                        </h4>
                        <p className="text-gray-600">{feedback.position}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {feedback.submittedDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={feedback.rating} />
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                            feedback.rating
                          )}`}
                        >
                          {feedback.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold text-sm text-gray-700 mb-2">
                          Interview Performance
                        </h5>
                        <p className="text-sm text-gray-600">
                          {feedback.interviewPerformance}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-700 mb-2">
                          Technical Skills
                        </h5>
                        <p className="text-sm text-gray-600">
                          {feedback.technicalSkills}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold text-sm text-gray-700 mb-2">
                          Communication
                        </h5>
                        <p className="text-sm text-gray-600">
                          {feedback.communication}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-700 mb-2">
                          Strengths
                        </h5>
                        <p className="text-sm text-gray-600">{feedback.strengths}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">
                        Areas for Improvement
                      </h5>
                      <p className="text-sm text-gray-600">
                        {feedback.areasForImprovement}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">
                        Overall Feedback
                      </h5>
                      <p className="text-gray-700">{feedback.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>

              {feedbacks.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <svg
                    className="w-20 h-20 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg mb-2">No feedback submitted yet</p>
                  <p className="text-sm mb-4">
                    Start providing feedback to help students improve
                  </p>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
