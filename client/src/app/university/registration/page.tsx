// app/university/registration/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// Sidebar layout primitives
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Your simplified university sidebar (4 links)
import { AppSidebar } from "@/components/ui/university/app-sidebar"; // adjust path if needed

// lucide icons
import {
  University,
  Mail,
  Lock,
  ShieldCheck,
  MapPin,
  Phone,
  Globe,
  BadgeCheck,
  Calendar,
  Users,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";

interface RegistrationForm {
  universityName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
  website: string;
  accreditation: string;
  establishedYear: string;
  totalStudents: string;
  description: string;
}

export default function UniversityRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationForm>({
    universityName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    website: "",
    accreditation: "",
    establishedYear: "",
    totalStudents: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<1 | 2>(1);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, send to your backend here
      // await api.registerUniversity(formData)

      toast.success("Registration submitted for verification!");
      setVerificationStep(2);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStep === 2) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold text-gray-900">
                University Registration
              </h1>
            </div>
          </header>

          <main className="min-h-screen bg-gray-50">
            <div className="min-h-[70vh] flex items-center justify-center px-4">
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
                    <Link
                      href="/login"
                      className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                    >
                      Back to Login
                    </Link>
                    <button
                      onClick={() => setVerificationStep(1)}
                      className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Edit Registration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content pane */}
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold text-gray-900">
              University Registration
            </h1>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50 py-10">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center">
              Register Your University
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Complete the form below to request access to the University
              Portal.
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
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

              {/* Year + Total Students */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Established Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="establishedYear"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      placeholder="e.g., 1990"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Total Students
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="totalStudents"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.totalStudents}
                      onChange={handleChange}
                      placeholder="Approximate number"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full university address"
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

              {/* Accreditation */}
              <div>
                <label className="block text-gray-700 mb-2">Accreditation</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="accreditation"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., MOE, International Accreditation"
                    value={formData.accreditation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2">
                  University Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Describe your university, programs offered, achievements, and mission..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Process box */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-700" />
                  <h4 className="font-semibold text-blue-800">
                    Registration Process
                  </h4>
                </div>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 mt-0.5" />
                    <span>Submit your registration details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 mt-0.5" />
                    <span>Our team will verify your university information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 mt-0.5" />
                    <span>
                      You&apos;ll receive an approval email within 1–2 business
                      days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 mt-0.5" />
                    <span>Once approved, you can access the portal</span>
                  </li>
                </ul>
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
