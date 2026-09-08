import axios from 'axios';

// Prefer same-origin /api in dev (Vite proxy) to avoid CORS.
// Override with VITE_API_URL when calling the API host directly.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
  updateMe: (payload) => api.patch('/auth/me', payload).then((r) => r.data.data),
};

export const dashboardApi = {
  get: () => api.get('/dashboard').then((r) => r.data.data),
};

export const usersApi = {
  list: (params) => api.get('/users', { params }).then((r) => r.data.data),
  meta: () => api.get('/users/meta').then((r) => r.data.data),
  createStudent: (payload) =>
    api.post('/users/students', payload).then((r) => r.data.data),
  updateStudent: (id, payload) =>
    api.put(`/users/students/${id}`, payload).then((r) => r.data.data),
  deleteStudent: (id) =>
    api.delete(`/users/students/${id}`).then((r) => r.data.data),
  createTeacher: (payload) =>
    api.post('/users/teachers', payload).then((r) => r.data.data),
  updateTeacher: (id, payload) =>
    api.put(`/users/teachers/${id}`, payload).then((r) => r.data.data),
  deleteTeacher: (id) =>
    api.delete(`/users/teachers/${id}`).then((r) => r.data.data),
  updateUser: (id, payload) =>
    api.put(`/users/${id}`, payload).then((r) => r.data.data),
};

export const knowledgeCheckApi = {
  list: () => api.get('/knowledge-checks').then((r) => r.data.data),
  get: (id) => api.get(`/knowledge-checks/${id}`).then((r) => r.data.data),
  create: (payload) =>
    api.post('/knowledge-checks', payload).then((r) => r.data.data),
  update: (id, payload) =>
    api.put(`/knowledge-checks/${id}`, payload).then((r) => r.data.data),
  attach: (payload) =>
    api.patch('/knowledge-checks/attach', payload).then((r) => r.data.data),
  remove: (id) =>
    api.delete(`/knowledge-checks/${id}`).then((r) => r.data.data),
  submitAttempt: (id, payload) =>
    api.post(`/knowledge-checks/${id}/attempts`, payload).then((r) => r.data.data),
};

export const timetableApi = {
  list: (params) => api.get('/timetables', { params }).then((r) => r.data.data),
  get: (className) =>
    api.get(`/timetables/${className}`).then((r) => r.data.data),
  save: (className, payload) =>
    api.put(`/timetables/${className}`, payload).then((r) => r.data.data),
};

export const examApi = {
  list: () => api.get('/exams').then((r) => r.data.data),
  create: (payload) => api.post('/exams', payload).then((r) => r.data.data),
  update: (id, payload) =>
    api.put(`/exams/${id}`, payload).then((r) => r.data.data),
  addSchedule: (id, payload) =>
    api.post(`/exams/${id}/schedules`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/exams/${id}`).then((r) => r.data.data),
  removeSchedule: (id, scheduleId) =>
    api.delete(`/exams/${id}/schedules/${scheduleId}`).then((r) => r.data.data),
};

export const feeApi = {
  list: () => api.get('/fees').then((r) => r.data.data),
  update: (id, payload) =>
    api.put(`/fees/${id}`, payload).then((r) => r.data.data),
};

export const notificationApi = {
  list: () => api.get('/notifications').then((r) => r.data.data),
  markRead: (id) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data.data),
  markAllRead: () =>
    api.patch('/notifications/read-all').then((r) => r.data.data),
};

export default api;
