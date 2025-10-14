import api from './api';

export const getQuizzes = async (params?: any) => {
  const response = await api.get('/quizzes', { params });
  return response.data;
};

export const getQuiz = async (id: string) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const getQuizQuestions = async (id: string) => {
  const response = await api.get(`/quizzes/${id}/questions`);
  return response.data;
};

export const submitQuiz = async (id: string, answers: any[], timeSpent: number) => {
  const response = await api.post(`/quizzes/${id}/submit`, { answers, timeSpent });
  return response.data;
};

export const getMyAttempts = async () => {
  const response = await api.get('/quizzes/my-attempts');
  return response.data;
};

export const getAttempt = async (id: string) => {
  const response = await api.get(`/quizzes/attempts/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/quizzes/categories');
  return response.data;
};
