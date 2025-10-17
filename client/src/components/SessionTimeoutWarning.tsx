'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

interface SessionTimeoutWarningProps {
  warningTimeMinutes?: number; // Show warning X minutes before timeout
  sessionTimeoutMinutes?: number; // Total session duration
}

/**
 * Session timeout warning component - similar to Gmail, LinkedIn
 * Warns users before their session expires and offers to extend
 */
export default function SessionTimeoutWarning({
  warningTimeMinutes = 5,
  sessionTimeoutMinutes = 60, // Default: 1 hour sessions
}: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      return;
    }

    const checkSessionTimeout = () => {
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (!loginTimestamp) return;

      const loginTime = parseInt(loginTimestamp);
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - loginTime) / (1000 * 60);
      const remainingMinutes = sessionTimeoutMinutes - elapsedMinutes;

      if (remainingMinutes <= warningTimeMinutes && remainingMinutes > 0) {
        setShowWarning(true);
        setMinutesLeft(Math.ceil(remainingMinutes));
      } else if (remainingMinutes <= 0) {
        // Session expired - force logout
        setShowWarning(false);
        // The API will handle the actual logout
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkSessionTimeout();

    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, warningTimeMinutes, sessionTimeoutMinutes]);

  const extendSession = async () => {
    // Refresh the session by calling checkAuth
    await checkAuth();
    localStorage.setItem('loginTimestamp', Date.now().toString());
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Session Expiring Soon
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Your session will expire in <span className="font-semibold text-yellow-600">{minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}</span>.
              You'll be logged out automatically.
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={extendSession}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowWarning(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
