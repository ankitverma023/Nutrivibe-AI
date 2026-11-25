import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/water`;

const waterApi = axios.create();

waterApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function fetchWater(date) {
  const response = await waterApi.get(API_URL, {
    params: date ? { date } : {},
  });
  return response.data.data;
}

export async function updateWater(date, glasses, targetGlasses) {
  const response = await waterApi.post(API_URL, {
    date,
    glasses,
    targetGlasses,
  });
  return response.data.data;
}

export async function addWaterGlass(date) {
  const response = await waterApi.post(`${API_URL}/add-glass`, { date });
  return response.data.data;
}

export async function resetWater(date) {
  const response = await waterApi.post(`${API_URL}/reset`, { date });
  return response.data.data;
}
