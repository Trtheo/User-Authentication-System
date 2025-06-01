// frontend/src/api.js
import axios from 'axios';

// Use environment variable for the base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});

// Optional: Add a response interceptor to handle token expiration globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error response is 401 Unauthorized, and it's not the login/register route itself
    // and specifically if the token expired (customize based on backend error messages)
    if (error.response && error.response.status === 401 && error.response.data.error === 'Token expired') {
      console.log('Token expired. Logging out...');
      localStorage.removeItem('token');
      // Redirect to login page
      window.location.href = '/login'; // Force full page reload to clear state
    }
    return Promise.reject(error);
  }
);


export default API;