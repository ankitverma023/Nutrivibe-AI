
import axios from 'axios';

const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
}/auth`;

export async function registerUser(userData) {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/login`, credentials);

  const token = response.data.token;
  const user = response.data.data || response.data.user;

  if (!token || !user) {
    throw new Error('Invalid login response from server.');
  }

  // Save authentication details after successful login.
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return { token, user };
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    logoutUser();
    return null;
  }
}
