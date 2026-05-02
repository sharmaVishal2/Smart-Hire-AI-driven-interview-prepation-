import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  if (url.startsWith('/api/guest') || url.startsWith('/guest') || url.startsWith('/api/auth') || url.startsWith('/auth')) {
    return config;
  }
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

const guestHeaders = () => ({ 'X-Guest-Session': localStorage.getItem('smarthire_guest_session') });

export const apiErrorMessage = (err, fallback = 'Request failed') => {
  if (err.code === 'ECONNABORTED') {
    return 'Backend is not responding. Start the backend or check VITE_API_BASE_URL.';
  }
  if (err.message === 'Network Error') {
    return 'Cannot reach the backend. Start it on http://localhost:8080 or set VITE_API_BASE_URL.';
  }
  return err.response?.data?.message || fallback;
};

export const createGuestSession = () => api.post('/api/guest/sessions').then((r) => r.data);
export const uploadGuestResume = (file) => {
  const data = new FormData();
  data.append('file', file);
  return api.post('/api/guest/resumes', data, {
    headers: { ...guestHeaders(), 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
export const startGuestInterview = () => api.post('/api/guest/interviews/start', null, { headers: guestHeaders() }).then((r) => r.data);
export const submitGuestAnswer = (interviewId, payload) => api.post(`/api/guest/interviews/${interviewId}/answers`, payload, { headers: guestHeaders() }).then((r) => r.data);
export const guestInterviewDetail = (id) => api.get(`/api/guest/interviews/${id}`, { headers: guestHeaders() }).then((r) => r.data);

export default api;
