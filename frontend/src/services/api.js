import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to automatically add JWT session token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("agri_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to catch unauthorized session expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only auto-logout if token was present and rejected (session expired)
            const token = localStorage.getItem("agri_token");
            if (token && !error.config.url.includes("/auth/login")) {
                localStorage.removeItem("agri_token");
                localStorage.removeItem("agri_user");
                // Notify window
                window.dispatchEvent(new Event("agri_session_expired"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
