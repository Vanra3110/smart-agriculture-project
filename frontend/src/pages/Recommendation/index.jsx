import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import api from "../../services/api";
import InputField from "../../components/InputField";
import RecommendationResult from "../../components/Recommendation";
import { useAuth } from "../../context/AuthContext";

function Recommendation() {
    const { user, isAuthenticated, refreshUser } = useAuth();
    const location = useLocation();

    const [formData, setFormData] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [savedNotice, setSavedNotice] = useState(false);

    const recommendationRef = useRef(null);

    // Prefill inputs if redirected from history item
    useEffect(() => {
        if (location.state?.prefillInputs) {
            const p = location.state.prefillInputs;
            setFormData({
                N: p.N ?? "",
                P: p.P ?? "",
                K: p.K ?? "",
                temperature: p.temperature ?? "",
                humidity: p.humidity ?? "",
                ph: p.ph ?? "",
                rainfall: p.rainfall ?? "",
            });
        }
    }, [location.state]);

    useEffect(() => {
        if (result) {
            recommendationRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [result]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        // Clear the specific field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const getRecommendation = async () => {
        setError("");
        setFieldErrors({});
        setResult(null);
        setSavedNotice(false);

        const newFieldErrors = {};
        let hasError = false;

        const ranges = {
            N: { min: 0, max: 150 },
            P: { min: 0, max: 150 },
            K: { min: 0, max: 250 },
            ph: { min: 0, max: 14 },
            temperature: { min: -50, max: 60 },
            humidity: { min: 0, max: 100 },
            rainfall: { min: 0, max: 300 },
        };

        const data = {};

        for (const key of Object.keys(formData)) {
            const rawValue = formData[key];
            if (rawValue === "") {
                newFieldErrors[key] = "This field is required.";
                hasError = true;
                continue;
            }

            const val = Number(rawValue);
            if (Number.isNaN(val)) {
                newFieldErrors[key] = "Please enter a valid number.";
                hasError = true;
                continue;
            }

            const { min, max } = ranges[key];
            if (val < min || val > max) {
                newFieldErrors[key] = `Value must be between ${min} and ${max}.`;
                hasError = true;
                continue;
            }

            data[key] = val;
        }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/crop/recommend", data);
            setResult(response.data);

            if (isAuthenticated) {
                setSavedNotice(true);
                refreshUser();
            }
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message ||
                "Unable to get crop recommendation. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-16 pb-10 px-3 sm:px-6 lg:px-8">
            {/* Input Form */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm"
            >
                {/* Session Notice Banner */}
                {isAuthenticated ? (
                    <div className="mb-6 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>
                                Session active for <strong>{user?.name}</strong> • Recommendations are saved to your farm history
                            </span>
                        </div>
                        <Link
                            to="/profile"
                            className="font-bold text-emerald-700 hover:text-emerald-800 underline decoration-emerald-400 underline-offset-2 self-start sm:self-auto"
                        >
                            View History →
                        </Link>
                    </div>
                ) : (
                    <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <span>💡</span>
                            <span>
                                <strong>Guest mode:</strong> Sign in to keep a historical log of all your soil tests and AI predictions.
                            </span>
                        </div>
                        <Link
                            to="/login"
                            className="font-semibold text-emerald-600 hover:text-emerald-700 transition self-start sm:self-auto"
                        >
                            Log in / Register →
                        </Link>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-slate-900">
                        Crop Recommendation
                    </h2>

                    <p className="mt-2 text-slate-500 text-sm">
                        Enter the current soil nutrients and environmental conditions of your agricultural field.
                    </p>
                </motion.div>

                {/* Soil Information */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { delayChildren: 0.3, staggerChildren: 0.1 },
                        },
                    }}
                    className="mt-8"
                >
                    <h3 className="text-lg font-semibold text-slate-900">
                        Soil Information
                    </h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Nitrogen (N)"
                                type="range"
                                name="N"
                                value={formData.N}
                                onChange={handleChange}
                                error={fieldErrors.N}
                                placeholder="e.g. 90"
                                min="0"
                                max="150"
                                unit="mg/kg"
                                hint="Available nitrogen in the soil"
                            />
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Phosphorus (P)"
                                type="range"
                                name="P"
                                value={formData.P}
                                onChange={handleChange}
                                error={fieldErrors.P}
                                placeholder="e.g. 42"
                                min="0"
                                max="150"
                                unit="mg/kg"
                                hint="Available phosphorus in the soil"
                            />
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Potassium (K)"
                                type="range"
                                name="K"
                                value={formData.K}
                                onChange={handleChange}
                                error={fieldErrors.K}
                                placeholder="e.g. 43"
                                min="0"
                                max="250"
                                unit="mg/kg"
                                hint="Available potassium in the soil"
                            />
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Soil pH"
                                type="range"
                                name="ph"
                                value={formData.ph}
                                onChange={handleChange}
                                error={fieldErrors.ph}
                                placeholder="e.g. 6.5"
                                step="0.1"
                                min="0"
                                max="14"
                                hint="Soil pH level"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Environmental Conditions */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { delayChildren: 0.6, staggerChildren: 0.1 },
                        },
                    }}
                    className="mt-8"
                >
                    <h3 className="text-lg font-semibold text-slate-900">
                        Environmental Conditions
                    </h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Temperature (°C)"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                error={fieldErrors.temperature}
                                placeholder="e.g. 21.5"
                                step="0.1"
                                min="-50"
                                max="60"
                                unit="°C"
                                hint="Current field temperature"
                            />
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Humidity (%)"
                                name="humidity"
                                value={formData.humidity}
                                onChange={handleChange}
                                error={fieldErrors.humidity}
                                placeholder="e.g. 82"
                                step="0.1"
                                min="0"
                                max="100"
                                unit="%"
                                hint="Relative humidity level"
                            />
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <InputField
                                label="Rainfall (mm)"
                                name="rainfall"
                                value={formData.rainfall}
                                onChange={handleChange}
                                error={fieldErrors.rainfall}
                                placeholder="e.g. 202"
                                step="0.1"
                                min="0"
                                max="300"
                                unit="mm"
                                hint="Rainfall amount"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-6 text-center text-xs leading-5 text-slate-400"
                >
                    Enter measured or estimated field conditions for the best possible recommendation.
                </motion.p>

                {/* Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={getRecommendation}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Analyzing field parameters...
                        </>
                    ) : (
                        "🌾 Recommend Crop"
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Saved Notice */}
                {savedNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2"
                    >
                        <span>✅</span>
                        <span>Saved to your personal crop history!</span>
                        <Link to="/profile" className="underline font-bold text-emerald-900 ml-1">
                            View Crop History →
                        </Link>
                    </motion.div>
                )}
            </motion.section>

            {/* Recommendation Result */}
            <div ref={recommendationRef}>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <RecommendationResult result={result} />
                    </motion.div>
                )}
            </div>
        </main>
    );
}

export default Recommendation;