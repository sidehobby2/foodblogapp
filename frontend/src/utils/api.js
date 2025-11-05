import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    // Use Vite environment variable in production
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Fallback for development
    return 'http://localhost:5000';
};

const API_URL = getApiUrl();

console.log('🔧 API Configuration:');
console.log('   - API URL:', API_URL);
console.log('   - Environment:', import.meta.env.MODE);

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/auth';
            }
        }

        return Promise.reject(error);
    }
);

export default api;