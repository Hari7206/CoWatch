import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("cowatch_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function registerUser(username, password) {
    const res = await api.post("/register", { username, password });
    return res.data;
}

export async function loginUser(username, password) {
    const res = await api.post("/login", { username, password });
    return res.data;
}

export async function guestUser(username) {
    const res = await api.post("/guest", { username });
    return res.data;
}

export async function getMe() {
    const res = await api.get("/user");
    return res.data;
}