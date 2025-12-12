import axios from 'axios';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://docclassifier-backend-latest.onrender.com/api').replace(/\/+$/, '');
const API_BASE_WITH_SLASH = `${API_BASE}/`;

const normalizeUrl = (url?: string) => {
    if (!url) {
        return url;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return url.replace(/^\/+/, '');
};

export const apiClient = axios.create({
    baseURL: API_BASE_WITH_SLASH,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (config.url) {
        config.url = normalizeUrl(config.url);
    }
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Optional: Redirect to login or clear token
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
