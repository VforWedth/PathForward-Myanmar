'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ProfileCompletion() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [additionalData, setAdditionalData] = useState<any>({});

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfile(response.data.profile);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    const requiredFields: Record<string, string[]> = {
      student: ['firstName', 'lastName', 'major', 'year', 'location', 'jobPreference', 'bio', 'skills'],
      company: ['companyName', 'industry', 'location', 'companySize', 'website', 'description'],
      university: ['universityName', 'location', 'website', 'supportedMajors', 'description'],
      freelancer: ['firstName', 'lastName', 'skills', 'location', 'hourlyRate', 'bio', 'portfolioUrl'],
    };

    const fields = requiredFields[user?.role || 'student'] || [];
    const filledFields = fields.filter((field) => {
      const value = profile[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    });

    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleInputChange = (field: string, value: any) => {
    setAdditionalData({
      ...additionalData,
      [field]: value,
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update profile based on user role
      const endpoint = `/${user?.role}/profile`;
      await api.put(endpoint, additionalData);
      toast.success('Profile updated successfully!');
      redirectToDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setIsSaving(false);
    }
  };

  const redirectToDashboard = () => {
    const dashboardRoutes: Record<string, string> = {
      student: '/student/dashboard',
      company: '/company/dashboard',
      university: '/university/dashboard',
      freelancer: '/freelancer/dashboard',
      admin: '/admin/dashboard',
    };

    const route = dashboardRoutes[user?.role || 'student'];
    router.push(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg
                className="w-16 h-16 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to PathForward Myanmar! 🎉
            </h1>
            <p className="text-gray-600">
              Your account has been created successfully. Let's complete your profile to get the best experience.
            </p>
          </div>

          {/* Profile Completion Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-blue-600">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  completionPercentage < 50
                    ? 'bg-red-500'
                    : completionPercentage < 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completionPercentage < 50
                ? 'Complete your profile to unlock all features'
                : completionPercentage < 80
                ? 'Almost there! Add more details to stand out'
                : 'Great! Your profile is looking good'}
            </p>
          </div>

          {/* Current Profile Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              What you've already provided:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Email Address</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Account Type</span>
              </div>
              {profile?.firstName && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Name</span>
                </div>
              )}
              {profile?.companyName && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Company Name</span>
                </div>
              )}
              {profile?.universityName && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">University Name</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add More Details (Optional)
          </h2>
          <p className="text-gray-600 mb-6">
            Adding more information helps you get better matches and opportunities.
          </p>

          <div className="space-y-4">
            {/* Student Additional Fields */}
            {user?.role === 'student' && (
              <>
                {!profile?.bio && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Bio / About Me
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your interests, and career goals..."
                    />
                  </div>
                )}

                {(!profile?.skills || profile.skills.length === 0) && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Skills
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        handleInputChange(
                          'skills',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      placeholder="JavaScript, Python, Communication (comma-separated)"
                    />
                  </div>
                )}

                {!profile?.portfolioUrl && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                )}
              </>
            )}

            {/* Company Additional Fields */}
            {user?.role === 'company' && (
              <>
                {!profile?.description && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Company Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your company, mission, and culture..."
                    />
                  </div>
                )}
              </>
            )}

            {/* University Additional Fields */}
            {user?.role === 'university' && (
              <>
                {!profile?.description && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      University Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your university, programs, and achievements..."
                    />
                  </div>
                )}
              </>
            )}

            {/* Freelancer Additional Fields */}
            {user?.role === 'freelancer' && (
              <>
                {!profile?.bio && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Describe your experience, expertise, and what makes you unique..."
                    />
                  </div>
                )}

                {!profile?.portfolioUrl && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={redirectToDashboard}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving || Object.keys(additionalData).length === 0}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Complete Profile & Continue'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            You can always update your profile later from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
