"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// lucide icons
import {
  University,
  Mail,
  Lock,
  MapPin,
  Phone,
  Globe,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface RegistrationForm {
  universityName: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  phone: string;
  website: string;
  description: string;
  supportedMajors: string[];
}

export default function UniversityRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationForm>({
    universityName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    phone: "",
    website: "",
    description: "",
    supportedMajors: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<1 | 2>(1);
  const [currentMajor, setCurrentMajor] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMajor = () => {
    if (currentMajor.trim() && !formData.supportedMajors.includes(currentMajor.trim())) {
      setFormData(prev => ({
        ...prev,
        supportedMajors: [...prev.supportedMajors, currentMajor.trim()]
      }));
      setCurrentMajor("");
    }
  };

  const removeMajor = (major: string) => {
    setFormData(prev => ({
      ...prev,
      supportedMajors: prev.supportedMajors.filter(m => m !== major)
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.universityName.trim()) {
      toast.error("University name is required");
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
        role: 'university',
        universityName: formData.universityName,
        location: formData.location,
        description: formData.description,
        website: formData.website,
        supportedMajors: formData.supportedMajors
      };

      console.log('Sending university registration:', registrationData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      console.log('University registration response:', data);

      if (response.ok && data.success) {
        toast.success(data.message || "Registration submitted for verification!");
        setVerificationStep(2);
        
        // Store token and redirect after success
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
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
              Your university registration has been submitted for
              verification. You&apos;ll receive an email once your account
              is approved. This process typically takes 1–2 business days.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/university/dashboard')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setVerificationStep(1)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Edit Registration
              </button>
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
          Register Your University
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Complete the form below to request access to the University Portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University Name */}
          <div>
            <label className="block text-gray-700 mb-2">
              University Name *
            </label>
            <div className="relative">
              <University className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="universityName"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., PathForward University"
              />
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
                placeholder="official@university.edu.mm"
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
              <label className="block text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
          </div>

          {/* Location */}
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
                placeholder="City, State, Country"
              />
            </div>
          </div>

          {/* Phone + Website */}
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
                  placeholder="University contact number"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://university.edu.mm"
                />
              </div>
            </div>
          </div>

          {/* Supported Majors */}
          <div>
            <label className="block text-gray-700 mb-2">Supported Majors</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={currentMajor}
                onChange={(e) => setCurrentMajor(e.target.value)}
                placeholder="Add a major (e.g., Computer Science)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMajor())}
              />
              <button
                type="button"
                onClick={addMajor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.supportedMajors.map((major) => (
                <span
                  key={major}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {major}
                  <button
                    type="button"
                    onClick={() => removeMajor(major)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">
              University Description *
            </label>
            <textarea
              name="description"
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe your university, programs offered, achievements, and mission..."
              value={formData.description}
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
              "Register University"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}