import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        farmLocation: "",
        farmSize: "",
        soilType: "Loamy",
        phone: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (isAuthenticated) {
        navigate("/recommend", { replace: true });
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

        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
            setError("Please fill in name, email, and password.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const res = await register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                farmLocation: formData.farmLocation.trim(),
                farmSize: formData.farmSize.trim(),
                soilType: formData.soilType,
                phone: formData.phone.trim(),
            });

            if (res.success) {
                navigate("/recommend", { replace: true });
            } else {
                setError(res.error || "Registration failed.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full flex-1 flex items-center justify-center py-6 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full md:w-[75%] max-w-3xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-5">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: -10 }}
                        className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-2xl shadow-inner mb-2.5"
                    >
                        🌱
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        Create Your Farmer Account
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Join Smart Agriculture AI to save soil parameters, track crop history & get personalized recommendations.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-5 sm:p-7 backdrop-blur-sm">
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
                        {/* Section 1: Account Credentials */}
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2.5 flex items-center gap-1.5">
                                <span>👤</span> Account Credentials
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Ramesh Patel"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="farmer@example.com"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 6 characters"
                                            className="w-full pl-3 pr-12 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Farm & Soil Profile */}
                        <div className="pt-2 border-t border-slate-100">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2.5 flex items-center gap-1.5">
                                <span>🚜</span> Farm & Soil Details (Optional)
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Farm Location
                                    </label>
                                    <input
                                        type="text"
                                        name="farmLocation"
                                        value={formData.farmLocation}
                                        onChange={handleChange}
                                        placeholder="City / Region"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Farm Size
                                    </label>
                                    <input
                                        type="text"
                                        name="farmSize"
                                        value={formData.farmSize}
                                        onChange={handleChange}
                                        placeholder="e.g. 5 Acres"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Primary Soil
                                    </label>
                                    <select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    >
                                        <option value="Loamy">Loamy Soil</option>
                                        <option value="Alluvial">Alluvial Soil</option>
                                        <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                                        <option value="Red & Yellow">Red & Yellow Soil</option>
                                        <option value="Clayey">Clayey Soil</option>
                                        <option value="Sandy">Sandy Soil</option>
                                        <option value="Laterite">Laterite Soil</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Phone / Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91..."
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    <span>Registering & Starting Session...</span>
                                </>
                            ) : (
                                <>
                                    <span>Register Account</span>
                                    <span>🌾</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Switch to Login */}
                <p className="text-center mt-4 text-xs sm:text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
                    >
                        Sign in here
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
