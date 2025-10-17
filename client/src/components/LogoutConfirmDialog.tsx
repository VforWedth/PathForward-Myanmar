'use client';

import { useState } from 'react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Logout confirmation dialog - provides better UX before logging out
 * Similar to Gmail, Facebook, LinkedIn confirmation dialogs
 */
export default function LogoutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Higher z-index to appear above sidebar */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Dialog - Highest z-index to appear above everything */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-gray-200">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-full ring-4 ring-red-100">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Confirm Logout
          </h3>

          {/* Message */}
          <p className="text-gray-700 text-center mb-8 leading-relaxed">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Logging out...</span>
                </>
              ) : (
                'Yes, Logout'
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
