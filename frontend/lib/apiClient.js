import { getToken, logout } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic fetch function with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: options.headers || createHeaders(options.auth !== false)
    });
    
    const data = await response.json();
    
    // Handle unauthorized errors
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      window.location.href = '/auth';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    auth: false
  }),
  
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    auth: false
  }),
  
  getCurrentUser: () => fetchAPI('/auth/me'),
  
  refreshToken: (refreshToken) => fetchAPI('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    auth: false
  })
};

// User API calls
export const userAPI = {
  updateProfile: (userData) => fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  getStats: () => fetchAPI('/users/stats')
};

export default {
  auth: authAPI,
  user: userAPI
};