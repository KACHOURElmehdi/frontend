import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://docclassifier-backend-latest.onrender.com/api').replace(/\/+$/, '');
const API_URL_WITH_SLASH = `${API_URL}/`;

const normalizeUrl = (url?: string) => {
    if (!url) {
        return url;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return url.replace(/^\/+/, '');
};

const api = axios.create({
    baseURL: API_URL_WITH_SLASH,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (config.url) {
        config.url = normalizeUrl(config.url);
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
