import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/analytics`;

const analyticsApi = axios.create();

analyticsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function fetchWeeklyAnalytics(endDate) {
  const response = await analyticsApi.get(`${API_URL}/weekly`, {
    params: endDate ? { endDate } : {},
  });
  return response.data.data;
}

export async function fetchOverallSummary() {
  const response = await analyticsApi.get(`${API_URL}/summary`);
  return response.data.data;
}
