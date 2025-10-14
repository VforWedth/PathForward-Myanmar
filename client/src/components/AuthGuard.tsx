'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student' | 'company' | 'university' | 'freelancer';
  fallbackRoute?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackRoute = '/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication if not already done
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    // Wait for authentication to be initialized
    if (!isInitialized) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push(fallbackRoute);
      return;
    }

    // If specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      console.log(`Access denied: User role '${user.role}' does not match required role '${requiredRole}'`);
      router.push(fallbackRoute);
      return;
    }
  }, [isAuthenticated, user, isInitialized, requiredRole, fallbackRoute, router]);

  // Show loading while authentication is being checked
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!isAuthenticated || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}
