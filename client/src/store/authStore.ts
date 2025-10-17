import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'student' | 'company' | 'university' | 'freelancer';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false, 

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      if (!user || !user.role) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);

      // Store login timestamp for session management
      localStorage.setItem('loginTimestamp', Date.now().toString());

      console.log('Login successful, user role:', user.role);
      set({ user, token, isAuthenticated: true, isLoading: false, isInitialized: true });
      return user;
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;

      if (!user || !user.role) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      console.log('Registration successful, user role:', user.role);
      set({ user, token, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      // Optional: Call logout endpoint for logging purposes
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          // Ignore logout endpoint errors - client-side logout is sufficient
          console.log('Logout endpoint error (ignored):', error);
        }
      }
    } catch (error) {
      // Ignore any errors during logout
      console.log('Logout error (ignored):', error);
    } finally {
      // Always perform client-side cleanup
      localStorage.removeItem('token');
      localStorage.removeItem('loginTimestamp');
      localStorage.removeItem('redirectAfterLogin');
      // NOTE: We DON'T clear 'rememberedEmail' - users expect this to persist
      // This is how Gmail, Facebook, and other major sites handle it

      set({ user: null, token: null, isAuthenticated: false, isInitialized: true });

      // Use router for smoother navigation instead of hard redirect
      // This provides a better UX than window.location.href
      if (typeof window !== 'undefined') {
        // Small delay to allow state to update
        setTimeout(() => {
          window.location.href = '/login?message=Successfully logged out';
        }, 100);
      }
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, isInitialized: true });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.user, isAuthenticated: true, token, isInitialized: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
    }
  },

}));
