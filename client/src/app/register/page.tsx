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
    phone: '',
    role: 'student' as 'student' | 'company' | 'university' | 'freelancer',
    profileData: {} as any,
  });

  const handleRoleSelect = (role: typeof formData.role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Select Your Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleRoleSelect('student')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-bold mb-2">Student</h3>
              <p className="text-gray-600">
                Find internships and job opportunities
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('company')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-bold mb-2">Company</h3>
              <p className="text-gray-600">
                Post jobs and find talented candidates
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('university')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-bold mb-2">University</h3>
              <p className="text-gray-600">
                Connect students with companies
              </p>
            </button>
            <button
              onClick={() => handleRoleSelect('freelancer')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-bold mb-2">Freelancer</h3>
              <p className="text-gray-600">
                Find freelance projects and opportunities
              </p>
            </button>
          </div>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileData: {
                        ...formData.profileData,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileData: {
                        ...formData.profileData,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          {formData.role === 'company' && (
            <div>
              <label className="block text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profileData: {
                      ...formData.profileData,
                      companyName: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {formData.role === 'university' && (
            <div>
              <label className="block text-gray-700 mb-2">
                University Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profileData: {
                      ...formData.profileData,
                      universityName: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {formData.role === 'freelancer' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileData: {
                        ...formData.profileData,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileData: {
                        ...formData.profileData,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
