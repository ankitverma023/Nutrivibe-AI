
import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/profile`;

const profileApi = axios.create();

profileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function fetchProfile() {
  const response = await profileApi.get(API_URL);
  return response.data.data;
}

export async function updateProfile(profileData) {
  const response = await profileApi.put(API_URL, profileData);
  return response.data.data;
}
