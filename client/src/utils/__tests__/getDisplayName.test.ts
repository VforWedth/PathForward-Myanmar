import { getDisplayName, getFirstName, getFullDisplayName } from '../getDisplayName';

describe('getDisplayName', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: 'student' as const,
    isVerified: true,
  };

  const mockProfileData = {
    firstName: 'John',
    lastName: 'Doe',
  };

  describe('getDisplayName', () => {
    it('should return full name for student with profile data', () => {
      const result = getDisplayName(mockUser, mockProfileData);
      expect(result).toBe('John Doe');
    });

    it('should return first name only if last name is missing', () => {
      const profileData = { firstName: 'John' };
      const result = getDisplayName(mockUser, profileData);
      expect(result).toBe('John');
    });

    it('should return email prefix if no profile data', () => {
      const result = getDisplayName(mockUser, {});
      expect(result).toBe('test');
    });

    it('should return email prefix if no profile data at all', () => {
      const result = getDisplayName(mockUser);
      expect(result).toBe('test');
    });

    it('should return company name for company role', () => {
      const companyUser = { ...mockUser, role: 'company' as const };
      const companyProfile = { companyName: 'Acme Corp' };
      const result = getDisplayName(companyUser, companyProfile);
      expect(result).toBe('Acme Corp');
    });

    it('should return university name for university role', () => {
      const universityUser = { ...mockUser, role: 'university' as const };
      const universityProfile = { universityName: 'MIT' };
      const result = getDisplayName(universityUser, universityProfile);
      expect(result).toBe('MIT');
    });

    it('should return "User" for null user', () => {
      const result = getDisplayName(null);
      expect(result).toBe('User');
    });
  });

  describe('getFirstName', () => {
    it('should return first name for student', () => {
      const result = getFirstName(mockUser, mockProfileData);
      expect(result).toBe('John');
    });

    it('should return company name for company role', () => {
      const companyUser = { ...mockUser, role: 'company' as const };
      const companyProfile = { companyName: 'Acme Corp' };
      const result = getFirstName(companyUser, companyProfile);
      expect(result).toBe('Acme Corp');
    });
  });

  describe('getFullDisplayName', () => {
    it('should return full name with role for student', () => {
      const result = getFullDisplayName(mockUser, mockProfileData);
      expect(result).toBe('John Doe (Student)');
    });

    it('should return company name with role for company', () => {
      const companyUser = { ...mockUser, role: 'company' as const };
      const companyProfile = { companyName: 'Acme Corp' };
      const result = getFullDisplayName(companyUser, companyProfile);
      expect(result).toBe('Acme Corp (Company)');
    });
  });
});