import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string; // Optional direct name field
  role: 'admin' | 'student' | 'company' | 'university' | 'freelancer';
  isVerified: boolean;
  
  // Role-specific profile data (optional, fetched when needed)
  profileData?: {
    // Company fields
    companyName?: string;
    
    // Student/Freelancer fields
    firstName?: string;
    lastName?: string;
    
    // University fields
    universityName?: string;
  };
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
  fetchProfileData: () => Promise<void>;
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

  fetchProfileData: async () => {
    const { user, token } = useAuthStore.getState();
    if (!user || !token) return;

    try {
      let profileResponse;
      
      switch (user.role) {
        case 'company':
          profileResponse = await api.get('/company/profile');
          break;
        case 'student':
          profileResponse = await api.get('/student/profile');
          break;
        case 'university':
          profileResponse = await api.get('/university/profile');
          break;
        case 'freelancer':
          profileResponse = await api.get('/freelancer/profile');
          break;
        default:
          return;
      }

      if (profileResponse.data.success) {
        const profileData = profileResponse.data.data;
        
        // Map profile data to our interface
        const mappedProfileData: any = {};
        
        if (user.role === 'company') {
          mappedProfileData.companyName = profileData.companyName;
        } else if (user.role === 'student' || user.role === 'freelancer') {
          mappedProfileData.firstName = profileData.firstName;
          mappedProfileData.lastName = profileData.lastName;
        } else if (user.role === 'university') {
          mappedProfileData.universityName = profileData.universityName;
        }

        set((state) => ({
          user: {
            ...state.user!,
            profileData: mappedProfileData
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  },

}));
