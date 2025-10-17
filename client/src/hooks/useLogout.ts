'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for handling logout with confirmation dialog
 * Provides a better UX with loading states and confirmation
 */
export function useLogout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: authLogout } = useAuthStore();

  const initiateLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      // The logout function handles the redirect
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return {
    initiateLogout,
    confirmLogout,
    cancelLogout,
    showConfirm,
    isLoggingOut,
  };
}
