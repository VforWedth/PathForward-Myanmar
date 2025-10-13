import api from './api';

// Company Profile
export const getCompanyProfile = async () => {
  const response = await api.get('/company/profile');
  return response.data;
};

export const updateCompanyProfile = async (profileData: any) => {
  const response = await api.put('/company/profile', profileData);
  return response.data;
};

// Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/company/dashboard/stats');
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/company/dashboard/activity');
  return response.data;
};

// Jobs
export const createJob = async (jobData: any) => {
  const response = await api.post('/company/jobs', jobData);
  return response.data;
};

export const getCompanyJobs = async () => {
  const response = await api.get('/company/jobs');
  return response.data;
};

export const getJobById = async (jobId: string) => {
  const response = await api.get(`/company/jobs/${jobId}`);
  return response.data;
};

export const updateJob = async (jobId: string, jobData: any) => {
  const response = await api.put(`/company/jobs/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await api.delete(`/company/jobs/${jobId}`);
  return response.data;
};

export const closeJob = async (jobId: string) => {
  const response = await api.put(`/company/jobs/${jobId}/close`);
  return response.data;
};

// Applicants
export const getApplicants = async (filters?: {
  status?: string;
  position?: string;
  search?: string;
  jobId?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.position) params.append('position', filters.position);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.jobId) params.append('jobId', filters.jobId);

  const response = await api.get(`/company/applicants?${params.toString()}`);
  return response.data;
};

export const getApplicantById = async (applicantId: string) => {
  const response = await api.get(`/company/applicants/${applicantId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const response = await api.put(`/company/applicants/${applicationId}/status`, { status });
  return response.data;
};

export const getPositions = async () => {
  const response = await api.get('/company/applicants/positions');
  return response.data;
};

// Feedback
export const createFeedback = async (feedbackData: any) => {
  const response = await api.post('/company/feedback', feedbackData);
  return response.data;
};

export const getCompanyFeedback = async () => {
  const response = await api.get('/company/feedback');
  return response.data;
};

export const getFeedbackStats = async () => {
  const response = await api.get('/company/feedback/stats');
  return response.data;
};

export const getFeedbackById = async (feedbackId: string) => {
  const response = await api.get(`/company/feedback/${feedbackId}`);
  return response.data;
};

export const updateFeedback = async (feedbackId: string, feedbackData: any) => {
  const response = await api.put(`/company/feedback/${feedbackId}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (feedbackId: string) => {
  const response = await api.delete(`/company/feedback/${feedbackId}`);
  return response.data;
};
