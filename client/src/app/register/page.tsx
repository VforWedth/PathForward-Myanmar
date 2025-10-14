'use client';

import { useRouter } from 'next/navigation';

export default function RegisterRoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    router.push(`/register/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
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
