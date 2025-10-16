'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * AuthProvider - Handles global authentication initialization
 * This ensures auth state is checked once when the app loads,
 * maintaining sessions across page refreshes
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app mount
    // This runs once when the app loads, checking for existing tokens
    if (!isInitialized) {
      checkAuth();
    }
  }, [checkAuth, isInitialized]);

  // Don't render children until auth is initialized
  // This prevents flash of unauthenticated content
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
