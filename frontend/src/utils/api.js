import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    console.log('Environment variables:', import.meta.env);

    // Use Vite environment variable in production
    if (import.meta.env.VITE_API_URL) {
        console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
        return import.meta.env.VITE_API_URL;
    }

    // Fallback for development
    console.log('Using development fallback URL');
    return 'http://localhost:5000';
};

const API_URL = getApiUrl();

console.log(' API Configuration:');
console.log('   - API URL:', API_URL);
console.log('   - Environment:', import.meta.env.MODE);
console.log('   - VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);

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
        console.log(` ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error(' Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log(` ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(' Response Error:', error);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            // Redirect to login only if we're not already on auth page
            if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/auth';
            }
        }

        return Promise.reject(error);
    }
);

export default api;