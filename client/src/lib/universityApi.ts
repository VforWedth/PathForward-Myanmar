import api from './api';

// Get all students from university
export const getStudents = async (filters?: {
  major?: string;
  year?: number;
  status?: string;
  verificationStatus?: string;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }
  const response = await api.get(`/university/students?${params.toString()}`);
  return response.data;
};

// Verify student (approve/reject)
export const verifyStudent = async (studentId: string, data: { action: 'approve' | 'reject'; reason?: string }) => {
  const response = await api.post(`/university/verify-student/${studentId}`, data);
  return response.data;
};

// Get employment stats
export const getEmploymentStats = async () => {
  const response = await api.get('/university/employment-stats');
  return response.data;
};

// Generate employment report
export const generateReport = async (filters?: any) => {
  const response = await api.post('/university/generate-report', filters);
  return response.data;
};
