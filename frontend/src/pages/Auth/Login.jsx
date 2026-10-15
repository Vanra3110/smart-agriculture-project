import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/recommend";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If already authenticated, redirect
    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            setLoading(true);
            const res = await login(formData.email.trim(), formData.password);
            if (res.success) {
                navigate(from, { replace: true });
            } else {
                setError(res.error || "Failed to log in.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleFillDemo = () => {
        setFormData({
            email: "farmer@demo.com",
            password: "password123",
        });
        setError("");
    };

    return (
        <main className="w-full flex-1 flex items-center justify-center py-6 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full sm:w-[85%] md:w-[75%] max-w-xl mx-auto"
            >
                {/* Header Icon & Title */}
                <div className="text-center mb-6">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 10 }}
                        className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-2xl shadow-inner mb-3"
                    >
                        🌾
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome Back
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                        Sign in to access your farm details, AI crop history & recommendations.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-7 backdrop-blur-sm">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2"
                        >
                            <span>⚠️</span>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                                    ✉️
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="farmer@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                                    🔒
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-medium text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    <span>Starting session...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Helper */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Need a quick test?</span>
                        <button
                            type="button"
                            onClick={handleFillDemo}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold underline decoration-emerald-300 underline-offset-2 transition"
                        >
                            Fill Demo Credentials
                        </button>
                    </div>
                </div>

                {/* Switch to Register */}
                <p className="text-center mt-5 text-xs sm:text-sm text-slate-600">
                    Don't have an account yet?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
                    >
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
