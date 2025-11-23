import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if this is an authentication request (login/register)
      const isAuthRequest = error.config?.url?.includes('/auth/');

      // Don't redirect if it's an auth request - let the form handle the error
      if (!isAuthRequest) {
        const userStr = localStorage.getItem('user');
        let redirectUrl = '/';

        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.role === 'BARBEARIA' || user.role === 'BARBEIRO') {
              redirectUrl = '/login/barbearia';
            } else if (user.role === 'CLIENTE') {
              redirectUrl = '/login/cliente';
            }
          } catch (e) {
            // If parsing fails, default to root
          }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = redirectUrl;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
