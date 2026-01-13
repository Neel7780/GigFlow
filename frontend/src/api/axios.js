import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Enable sending cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth token from localStorage if not using cookies
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login or clear auth state
                    console.log('Unauthorized - Session expired');
                    // You could dispatch a logout action here
                    break;
                case 403:
                    console.log('Forbidden - Access denied');
                    break;
                case 404:
                    console.log('Resource not found');
                    break;
                case 500:
                    console.log('Server error');
                    break;
                default:
                    console.log('An error occurred');
            }
        } else if (error.request) {
            // Network error
            console.log('Network error - Please check your connection');
        }

        return Promise.reject(error);
    }
);

export default api;
