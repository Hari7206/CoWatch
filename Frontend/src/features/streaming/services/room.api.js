import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api/rooms`,
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cowatch_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function createRoom() {
    const res = await api.post('/');
    return res.data;
}