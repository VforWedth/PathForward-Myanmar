
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { Logo } from '@/components/brand/Logo';
import { brandMessaging } from '@/config/brand';

export default function Login() {
  const router = useRouter();
  const { login, user, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false 
  });
  const [showPassword, setShowPassword] = useState(false);

  // Load saved email if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  // Check for messages (logout, session expired, etc.)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const session = urlParams.get('session');

    if (message) {
      toast.success(message);
    } else if (session === 'expired') {
      toast.warning('Your session has expired. Please login again.');
    }

    // Clean up URL
    if (message || session) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Redirect after login based on user role or previous page
  useEffect(() => {
    if (!user) return;

    console.log('Login redirect - User role:', user.role);
    console.log('Login redirect - Full user object:', user);

    // Check if there was a redirect URL stored
    const redirectUrl = localStorage.getItem('redirectAfterLogin');

    if (redirectUrl) {
      console.log('Redirecting to stored URL:', redirectUrl);
      // Remove the stored redirect URL
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectUrl);
      return;
    }

    // Default role-based redirects
    if (user.role === 'admin') {
      console.log('Redirecting to admin dashboard');
      router.push('/admin/dashboard');
    } else if (user.role === 'student') {
      console.log('Redirecting to student dashboard');
      router.push('/student/dashboard');
    } else if (user.role === 'company') {
      console.log('Redirecting to company dashboard');
      router.push('/company/dashboard');
    } else if (user.role === 'university') {
      console.log('Redirecting to university dashboard');
      router.push('/university/dashboard');
    } else if (user.role === 'freelancer') {
      console.log('Redirecting to freelancer dashboard');
      router.push('/freelancer/dashboard');
    } else {
      console.error('Unknown role:', user.role);
      toast.error(`Unknown user role: ${user.role}`);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      
      // Handle "Remember Me"
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary-lighter)] p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--brand-primary-lighter)]/30 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--brand-primary-light)]/30 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full opacity-10 blur-3xl animate-float"></div>
      </div>

      <div className="glass backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/20 animate-scale-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="xl" showText={false} linkTo="/" className="animate-float" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-white/80 text-lg">
            Login to {brandMessaging.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-white mb-2 font-medium">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/50 backdrop-blur-sm transition-all hover:bg-white/20"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-white mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/50 backdrop-blur-sm transition-all hover:bg-white/20"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-white/60 hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-white/60 hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded cursor-pointer bg-white/10"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white/80 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-sm text-white/80 hover:text-white hover:underline font-medium transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-[var(--brand-primary)] rounded-xl hover:bg-white/90 transition-all disabled:bg-white/50 disabled:cursor-not-allowed font-bold text-lg shadow-2xl hover:shadow-white/50 hover-lift animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
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
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass text-white/80">
                Don't have an account?
              </span>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <button
          onClick={() => router.push('/register')}
          className="w-full py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all font-bold backdrop-blur-sm hover-lift animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          Create New Account
        </button>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-white/70 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          Having trouble logging in?{' '}
          <a href="/" className="text-white hover:underline font-medium">
            Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}
