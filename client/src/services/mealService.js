
import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/meals`;

// Automatically attach the JWT token to every meal request
const mealApi = axios.create();

mealApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export async function fetchMeals(date) {
  const response = await mealApi.get(API_URL, {
    params: date ? { date } : {},
  });

  return response.data.data;
}

export async function createMeal(meal) {
  const response = await mealApi.post(API_URL, meal);
  return response.data.data;
}

export async function removeMeal(id) {
  const response = await mealApi.delete(`${API_URL}/${id}`);
  return response.data;
}
