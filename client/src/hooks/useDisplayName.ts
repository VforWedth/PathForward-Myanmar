import { useAuthStore } from '@/store/authStore';
import { getDisplayName, getFirstName, getFullDisplayName } from '@/utils/getDisplayName';

/**
 * Custom hook to get user display name
 * @returns Object with display name functions and user data
 */
export const useDisplayName = () => {
  const { user } = useAuthStore();

  return {
    user,
    displayName: getDisplayName(user, user?.profileData),
    firstName: getFirstName(user, user?.profileData),
    fullDisplayName: getFullDisplayName(user, user?.profileData),
  };
};