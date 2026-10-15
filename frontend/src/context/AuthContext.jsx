import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("agri_token"));
    const [loading, setLoading] = useState(true);

    // Verify session on initial load if token exists
    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem("agri_token");
            if (!savedToken) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");
                if (response.data?.user) {
                    setUser(response.data.user);
                    setToken(savedToken);
                } else {
                    logout();
                }
            } catch (error) {
                console.warn("Session check failed or token expired:", error.message);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifySession();

        const handleSessionExpired = () => {
            setUser(null);
            setToken(null);
        };

        window.addEventListener("agri_session_expired", handleSessionExpired);
        return () => {
            window.removeEventListener("agri_session_expired", handleSessionExpired);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token: receivedToken, user: receivedUser } = response.data;

            localStorage.setItem("agri_token", receivedToken);
            setToken(receivedToken);
            setUser(receivedUser);

            return { success: true, user: receivedUser };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to login. Please check your credentials.";
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            const { token: receivedToken, user: receivedUser } = response.data;

            localStorage.setItem("agri_token", receivedToken);
            setToken(receivedToken);
            setUser(receivedUser);

            return { success: true, user: receivedUser };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            // Inform server to end session (optional acknowledgment)
            await api.post("/auth/logout").catch(() => {});
        } finally {
            localStorage.removeItem("agri_token");
            setToken(null);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const response = await api.get("/auth/me");
            if (response.data?.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
