import { useAuthStore } from '@/store/authStore';
import { getDisplayName, getFirstName, getFullDisplayName } from '@/utils/getDisplayName';

/**
 * Custom hook to get user display name with automatic profile data fetching
 * @returns Object with display name functions and user data
 */
export const useDisplayName = () => {
  const { user, fetchProfileData } = useAuthStore();

  // Fetch profile data if not already loaded
  const ensureProfileData = async () => {
    if (user && !user.profileData) {
      await fetchProfileData();
    }
  };

  return {
    user,
    displayName: getDisplayName(user, user?.profileData),
    firstName: getFirstName(user, user?.profileData),
    fullDisplayName: getFullDisplayName(user, user?.profileData),
    ensureProfileData,
    fetchProfileData,
  };
};