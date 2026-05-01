import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smarthire_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (payload) => api.post('/api/auth/register', payload).then((r) => r.data);
export const login = (payload) => api.post('/api/auth/login', payload).then((r) => r.data);
export const me = () => api.get('/api/users/me').then((r) => r.data);
export const uploadResume = (file) => {
  const data = new FormData();
  data.append('file', file);
  return api.post('/api/resumes', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
export const listResumes = () => api.get('/api/resumes').then((r) => r.data);
export const startInterview = () => api.post('/api/interviews/start').then((r) => r.data);
export const submitAnswer = (interviewId, payload) => api.post(`/api/interviews/${interviewId}/answers`, payload).then((r) => r.data);
export const interviewDetail = (id) => api.get(`/api/interviews/${id}`).then((r) => r.data);
export const interviewHistory = () => api.get('/api/interviews').then((r) => r.data);
export const dashboardStats = () => api.get('/api/interviews/stats').then((r) => r.data);

export default api;
