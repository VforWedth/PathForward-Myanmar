'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student' as 'student' | 'company' | 'university' | 'freelancer',
    profileData: {} as any,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 12.5;
    if (password.match(/[@$!%*?&]/)) strength += 12.5;
    return strength;
  };

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = { ...validationErrors };

    switch (name) {
      case 'email':
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (strength < 100) {
          errors.password = 'Password must contain uppercase, lowercase, number, and special character';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
      case 'phone':
        if (value && !value.match(/^[0-9+\-\s()]+$/)) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleRoleSelect = (role: typeof formData.role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleProfileDataChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      profileData: {
        ...formData.profileData,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix all validation errors');
      return;
    }

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      toast.success('Registration successful!');
      // Redirect to profile completion page
      router.push('/profile-completion');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Role</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Information</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Join PathForward Myanmar
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Select your role to get started
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleRoleSelect('student')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold mb-2">Student</h3>
              <p className="text-gray-600 text-sm">
                Find internships and job opportunities
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('company')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold mb-2">Company</h3>
              <p className="text-gray-600 text-sm">
                Post jobs and find talented candidates
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('university')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-xl font-bold mb-2">University</h3>
              <p className="text-gray-600 text-sm">
                Connect students with companies
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('freelancer')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-xl font-bold mb-2">Freelancer</h3>
              <p className="text-gray-600 text-sm">
                Find freelance projects and opportunities
              </p>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Role</span>
            </div>
            <div className="w-16 h-1 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Information</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Fill in your information to create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Min. 8 characters"
            />
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength < 50
                          ? 'bg-red-500'
                          : passwordStrength < 75
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength < 50
                      ? 'Weak'
                      : passwordStrength < 75
                      ? 'Medium'
                      : 'Strong'}
                  </span>
                </div>
              </div>
            )}
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+95 9XX XXX XXXX"
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>

          {/* Student Fields */}
          {formData.role === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Major</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('major', e.target.value)}
                  placeholder="e.g., Computer Science, Engineering"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Year</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('year', parseInt(e.target.value))}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="6">6th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Job Preference</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('jobPreference', e.target.value)}
                  >
                    <option value="onsite">Onsite</option>
                    <option value="remote">Remote</option>
                    <option value="ojt">OJT</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  placeholder="e.g., Yangon, Mandalay"
                />
              </div>
            </>
          )}

          {/* Company Fields */}
          {formData.role === 'company' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('companyName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Industry</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('industry', e.target.value)}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Company Size</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('companySize', e.target.value)}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Website</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('website', e.target.value)}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
            </>
          )}

          {/* University Fields */}
          {formData.role === 'university' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('universityName', e.target.value)}
                  placeholder="Your University Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Website</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleProfileDataChange('website', e.target.value)}
                  placeholder="https://www.university.edu"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Supported Majors
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    handleProfileDataChange(
                      'supportedMajors',
                      e.target.value.split(',').map((m) => m.trim())
                    )
                  }
                  placeholder="Computer Science, Engineering, Business (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter majors separated by commas
                </p>
              </div>
            </>
          )}

          {/* Freelancer Fields */}
          {formData.role === 'freelancer' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Skills</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    handleProfileDataChange(
                      'skills',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  placeholder="Web Development, Design, Marketing (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter skills separated by commas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleProfileDataChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      handleProfileDataChange('hourlyRate', parseFloat(e.target.value))
                    }
                    placeholder="25.00"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isLoading || Object.keys(validationErrors).length > 0}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
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
                  Creating Account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          By registering, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
