'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  GraduationCap,
  FileText,
  Globe,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  major: string;
  year: number | '';
  location: string;
  jobPreference: 'onsite' | 'remote' | 'ojt' | 'hybrid';
  portfolioUrl: string;
  bio: string;
  skills: string[];
}

export default function StudentRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    major: '',
    year: '',
    location: '',
    jobPreference: 'onsite',
    portfolioUrl: '',
    bio: '',
    skills: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<1 | 2>(1);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? (value === '' ? '' : parseInt(value)) : value,
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return false;
    }

    if (formData.year && (formData.year < 1 || formData.year > 6)) {
      toast.error('Year must be between 1 and 6');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const registrationData = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'student',
        firstName: formData.firstName,
        lastName: formData.lastName,
        major: formData.major,
        year: formData.year || null,
        location: formData.location,
        jobPreference: formData.jobPreference,
        portfolioUrl: formData.portfolioUrl,
        bio: formData.bio,
        skills: formData.skills,
      };

      console.log('Sending student registration:', registrationData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      console.log('Student registration response:', data);

      if (response.ok && data.success) {
        toast.success(data.message || 'Registration submitted for verification!');
        setVerificationStep(2);

        if (data.token) {
          localStorage.setItem('token', data.token);
          setTimeout(() => {
            router.push('/student/dashboard');
          }, 3000);
        }
      } else {
        toast.error(
          data.message ||
            `Registration failed: ${data.errors ? data.errors.join(', ') : 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Pending
            </h2>
            <p className="text-gray-600 mb-6">
              Your student registration has been submitted for verification. You&apos;ll
              receive an email once your account is approved. You can still login to view
              your pending status.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/student/dashboard')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
              <Link
                href="/login"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center">
          Register as Student
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Create your account to find internships and job opportunities
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">First Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Last Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+95 9 XXX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Yangon, Myanmar"
                />
              </div>
            </div>
          </div>

          {/* Major */}
          <div>
            <label className="block text-gray-700 mb-2">Major</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="major"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.major}
                onChange={handleChange}
                placeholder="Computer Science"
              />
            </div>
          </div>

          {/* Year & Job Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Year</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select
                  name="year"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.year}
                  onChange={handleChange}
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
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Job Preference *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select
                  name="jobPreference"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.jobPreference}
                  onChange={handleChange}
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="ojt">OJT</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-gray-700 mb-2">Portfolio URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                name="portfolioUrl"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://myportfolio.com"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-700 mb-2">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill (e.g., JavaScript)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-2">Bio *</label>
            <textarea
              name="bio"
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Tell us about yourself, your interests, and career goals..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Submitting...
              </>
            ) : (
              'Register as Student'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}