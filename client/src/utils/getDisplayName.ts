/**
 * Utility function to get display name based on user role and profile data
 * @param user - User object from auth store
 * @param profileData - Profile data from role-specific models (Company, Student, etc.)
 * @returns Display name string
 */
export const getDisplayName = (user: any, profileData?: any): string => {
  if (!user) return 'User';
  
  // If user has a direct name field, use it
  if (user.name) {
    return user.name;
  }
  
  // Fallback to email prefix
  const emailPrefix = user.email?.split('@')[0] || 'User';
  
  switch (user.role) {
    case 'company':
      return profileData?.companyName || emailPrefix;
    
    case 'student':
    case 'freelancer':
      const firstName = profileData?.firstName || '';
      const lastName = profileData?.lastName || '';
      if (firstName && lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      if (firstName) {
        return firstName;
      }
      return emailPrefix;
    
    case 'university':
      return profileData?.universityName || emailPrefix;
    
    case 'admin':
      return 'Admin';
    
    default:
      return emailPrefix;
  }
};

/**
 * Get user's first name only (useful for greetings)
 * @param user - User object from auth store
 * @param profileData - Profile data from role-specific models
 * @returns First name string
 */
export const getFirstName = (user: any, profileData?: any): string => {
  if (!user) return 'User';
  
  switch (user.role) {
    case 'company':
      return profileData?.companyName || user.email?.split('@')[0] || 'Company';
    
    case 'student':
    case 'freelancer':
      return profileData?.firstName || user.email?.split('@')[0] || 'User';
    
    case 'university':
      return profileData?.universityName || user.email?.split('@')[0] || 'University';
    
    case 'admin':
      return 'Admin';
    
    default:
      return user.email?.split('@')[0] || 'User';
  }
};

/**
 * Get user's full name with role context
 * @param user - User object from auth store
 * @param profileData - Profile data from role-specific models
 * @returns Full name with role context
 */
export const getFullDisplayName = (user: any, profileData?: any): string => {
  if (!user) return 'User';
  
  const displayName = getDisplayName(user, profileData);
  const role = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User';
  
  return `${displayName} (${role})`;
};