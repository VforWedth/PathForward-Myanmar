import axios from 'axios';

/**
 * Normalizes a URL by ensuring it has a proper protocol (http:// or https://)
 * Prevents malformed URLs when environment variables are missing protocol
 */
const normalizeUrl = (url: string): string => {
  if (!url) return url;

  // If it already has a protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Check if it looks like a domain (contains a dot and no slashes at start)
  // If so, add https:// for production domains
  if (url.includes('.') && !url.startsWith('/')) {
    // Log warning in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️  URL missing protocol: "${url}". Automatically adding "https://". ` +
        `Please update your environment variables to include the full URL.`
      );
    }
    return `https://${url}`;
  }

  // Otherwise return as is (likely a relative path or localhost)
  return url;
};

/**
 * Validates environment variables and logs helpful warnings
 */
const validateEnvVars = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!apiUrl) {
    console.warn('⚠️  NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000/api');
  }

  if (!serverUrl) {
    console.warn('⚠️  NEXT_PUBLIC_SERVER_URL is not set. Using fallback: http://localhost:5000');
  }

  // Check if URLs are properly formatted for production
  if (process.env.NODE_ENV === 'production') {
    if (apiUrl && !apiUrl.startsWith('https://')) {
      console.error(
        '❌ Production API URL should start with "https://". Current value:', apiUrl
      );
    }
    if (serverUrl && !serverUrl.startsWith('https://')) {
      console.error(
        '❌ Production SERVER URL should start with "https://". Current value:', serverUrl
      );
    }
  }
};

// Validate environment variables (only in browser)
if (typeof window !== 'undefined') {
  validateEnvVars();
}

const API_URL = normalizeUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
const SERVER_URL = normalizeUrl(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000');
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // This prevents infinite redirect loops
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      if (!isAuthPage) {
        localStorage.removeItem('token');

        // Store the current path to redirect back after login
        if (typeof window !== 'undefined' && currentPath !== '/') {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }

        // Use a more graceful redirect with a message
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// Utility function to get full URL for uploaded files
export const getFileUrl = (relativePath: string | undefined | null): string | null => {
  if (!relativePath) return null;
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Otherwise, prepend the server URL
  return `${SERVER_URL}${relativePath}`;
};
export default api;
