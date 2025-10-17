'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Wait for authentication to be initialized
    if (!isInitialized) {
      return;
    }

    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'company':
          router.push('/company/dashboard');
          break;
        case 'university':
          router.push('/university/dashboard');
          break;
        case 'freelancer':
          router.push('/freelancer/dashboard');
          break;
        default:
          router.push('/login');
      }
    }
  }, [isAuthenticated, user, isInitialized, router]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show loading while redirecting authenticated users
  if (isAuthenticated && user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          PathForward Myanmar
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connecting Myanmar's Youth to Their Future
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
