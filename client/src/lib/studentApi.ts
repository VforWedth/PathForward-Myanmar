import api from './api';

// Profile Management
export const getProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await api.put('/student/profile', data);
  return response.data;
};

export const updateStatus = async (status: 'available' | 'on_job' | 'internship_completed') => {
  const response = await api.put('/student/status', { status });
  return response.data;
};

export const uploadCV = async (file: File) => {
  const formData = new FormData();
  formData.append('cv', file);
  const response = await api.post('/student/upload-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const response = await api.post('/student/upload-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


// Education Management
export const addEducation = async (data: any) => {
  const response = await api.post('/student/education', data);
  return response.data;
};

export const updateEducation = async (id: string, data: any) => {
  const response = await api.put(`/student/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: string) => {
  const response = await api.delete(`/student/education/${id}`);
  return response.data;
};

// Experience Management
export const addExperience = async (data: any) => {
  const response = await api.post('/student/experience', data);
  return response.data;
};

export const updateExperience = async (id: string, data: any) => {
  const response = await api.put(`/student/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: string) => {
  const response = await api.delete(`/student/experience/${id}`);
  return response.data;
};

// Certificate Management
export const addCertificate = async (data: any) => {
  const response = await api.post('/student/certificate', data);
  return response.data;
};

export const updateCertificate = async (id: string, data: any) => {
  const response = await api.put(`/student/certificate/${id}`, data);
  return response.data;
};

export const deleteCertificate = async (id: string) => {
  const response = await api.delete(`/student/certificate/${id}`);
  return response.data;
};

// Feedback & Reviews
export const getMyFeedback = async () => {
  const response = await api.get('/student/feedback');
  return response.data;
};

export const submitReview = async (data: {
  companyId: string;
  rating: number;
  comment?: string;
  jobId?: string;
}) => {
  const response = await api.post('/student/reviews', data);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get('/student/reviews');
  return response.data;
};

export const createReview = submitReview; // Alias for compatibility
export const deleteReview = async (id: string) => {
  const response = await api.delete(`/student/reviews/${id}`);
  return response.data;
};

export const updateReview = async (id: string, data: any) => {
  const response = await api.put(`/student/reviews/${id}`, data);
  return response.data;
};

// Job & Application Management
export const getJobs = async (filters?: any) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });
  }
  const response = await api.get(`/jobs?${params.toString()}`);
  return response.data;
};

export const getJob = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const applyForJob = async (jobId: string) => {
  const response = await api.post(`/jobs/${jobId}/apply`);
  return response.data;
};

export const getMyApplications = async (status?: string) => {
  const params = status ? `?status=${status}` : '';
  const response = await api.get(`/student/applications${params}`);
  return response.data;
};

export const withdrawApplication = async (applicationId: string) => {
  const response = await api.delete(`/student/applications/${applicationId}`);
  return response.data;
};
