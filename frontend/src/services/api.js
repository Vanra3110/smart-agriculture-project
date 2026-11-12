import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 120000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("agri_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const token = localStorage.getItem("agri_token");
            if (token && !error.config.url.includes("/auth/login")) {
                localStorage.removeItem("agri_token");
                localStorage.removeItem("agri_user");
                window.dispatchEvent(new Event("agri_session_expired"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
