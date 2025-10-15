import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string; // Optional name field
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

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    // Redirect to login with success message
    window.location.href = '/login?message=Successfully logged out';
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
