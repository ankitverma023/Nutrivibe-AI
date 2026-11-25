import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/ai`;

const aiApi = axios.create();

aiApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function scanFood(query, imageBase64, fileName) {
  const response = await aiApi.post(`${API_URL}/scan-food`, {
    query,
    imageBase64,
    fileName,
  });
  return response.data.data;
}

export async function fetchAiInsights(totals, goals) {
  const response = await aiApi.post(`${API_URL}/insights`, {
    totals,
    goals,
  });
  return response.data.data;
}

export async function fetchDietRecommendations(profile, totals, dietFilter = 'all') {
  const response = await aiApi.post(`${API_URL}/diet-recommendations`, {
    profile,
    totals,
    dietFilter,
  });
  return response.data.data;
}

export async function fetchHealthRiskPrediction(profile, totals) {
  const response = await aiApi.post(`${API_URL}/health-risk-prediction`, {
    profile,
    totals,
  });
  return response.data.data;
}
