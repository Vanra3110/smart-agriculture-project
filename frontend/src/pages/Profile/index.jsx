import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const cropEmojis = {
    rice: "🌾",
    wheat: "🌾",
    maize: "🌽",
    corn: "🌽",
    cotton: "☁️",
    jute: "🌿",
    coffee: "☕",
    tea: "🍵",
    apple: "🍎",
    banana: "🍌",
    grapes: "🍇",
    watermelon: "🍉",
    muskmelon: "🍈",
    orange: "🍊",
    papaya: "🥭",
    coconut: "🥥",
    mango: "🥭",
    pomegranate: "🍎",
    lentil: "🍲",
    blackgram: "🌱",
    mungbean: "🌱",
    mothbeans: "🌱",
    pigeonpeas: "🌱",
    kidneybeans: "🫘",
    chickpea: "🫘",
};

const diseaseCropEmojis = {
    apple: "🍎",
    blueberry: "🫐",
    cherry: "🍒",
    corn: "🌽",
    maize: "🌽",
    grape: "🍇",
    orange: "🍊",
    peach: "🍑",
    pepper: "🫑",
    potato: "🥔",
    raspberry: "🍇",
    soybean: "🌱",
    squash: "🎃",
    strawberry: "🍓",
    tomato: "🍅",
};

export default function Profile() {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    // Tab state: "crops" or "diseases"
    const [activeTab, setActiveTab] = useState("crops");

    // Crop recommendation history state
    const [cropHistory, setCropHistory] = useState([]);
    const [loadingCrops, setLoadingCrops] = useState(true);
    const [cropError, setCropError] = useState("");

    // Disease diagnosis history state
    const [diseaseHistory, setDiseaseHistory] = useState([]);
    const [loadingDiseases, setLoadingDiseases] = useState(true);
    const [diseaseError, setDiseaseError] = useState("");
    const [expandedDiseaseIds, setExpandedDiseaseIds] = useState(new Set());

    // Filter and search
    const [searchTerm, setSearchTerm] = useState("");

    // Profile editing
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        farmLocation: user?.farmLocation || "",
        farmSize: user?.farmSize || "",
        soilType: user?.soilType || "Loamy",
        phone: user?.phone || "",
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");

    // Fetch crop recommendation history
    const fetchCropHistory = async () => {
        try {
            setLoadingCrops(true);
            setCropError("");
            const response = await api.get("/user/history");
            setCropHistory(response.data?.history || []);
        } catch (error) {
            console.error("Failed to fetch crop history:", error);
            setCropError("Could not load your crop history. Please try again.");
        } finally {
            setLoadingCrops(false);
        }
    };

    // Fetch plant disease diagnosis history
    const fetchDiseaseHistory = async () => {
        try {
            setLoadingDiseases(true);
            setDiseaseError("");
            const response = await api.get("/user/disease-history");
            setDiseaseHistory(response.data?.history || []);
        } catch (error) {
            console.error("Failed to fetch disease diagnosis history:", error);
            setDiseaseError("Could not load your plant disease diagnosis history.");
        } finally {
            setLoadingDiseases(false);
        }
    };

    useEffect(() => {
        fetchCropHistory();
        fetchDiseaseHistory();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Toggle expanded remedy view for a disease record
    const toggleExpandDisease = (id) => {
        setExpandedDiseaseIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Delete single crop recommendation item
    const handleDeleteCropItem = async (id) => {
        if (!window.confirm("Remove this crop recommendation from your history?")) return;
        try {
            await api.delete(`/user/history/${id}`);
            setCropHistory((prev) => prev.filter((item) => item._id !== id));
            refreshUser();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete item.");
        }
    };

    // Clear all crop recommendations
    const handleClearAllCropHistory = async () => {
        if (!window.confirm("Are you sure you want to clear your entire crop recommendation history?")) return;
        try {
            await api.delete("/user/history");
            setCropHistory([]);
            refreshUser();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to clear crop history.");
        }
    };

    // Delete single disease diagnosis item
    const handleDeleteDiseaseItem = async (id) => {
        if (!window.confirm("Remove this plant disease diagnosis record from your history?")) return;
        try {
            await api.delete(`/user/disease-history/${id}`);
            setDiseaseHistory((prev) => prev.filter((item) => item._id !== id));
            refreshUser();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete disease diagnosis.");
        }
    };

    // Clear all disease diagnosis history
    const handleClearAllDiseaseHistory = async () => {
        if (!window.confirm("Are you sure you want to clear your entire plant disease diagnosis history?")) return;
        try {
            await api.delete("/user/disease-history");
            setDiseaseHistory([]);
            refreshUser();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to clear disease history.");
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setSavingProfile(true);
            setProfileSuccess("");
            await api.put("/auth/profile", profileForm);
            await refreshUser();
            setIsEditingProfile(false);
            setProfileSuccess("Profile updated successfully!");
            setTimeout(() => setProfileSuccess(""), 4000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    // Filter crop history
    const filteredCropHistory = cropHistory.filter((item) => {
        const rawCrop = item.recommendedCrop || "";
        const resolvedCrop =
            !rawCrop || rawCrop.toLowerCase() === "unknown crop"
                ? item.topPredictions?.[0]?.crop || "Rice"
                : rawCrop;
        return resolvedCrop.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Filter disease history
    const filteredDiseaseHistory = diseaseHistory.filter((item) => {
        const q = searchTerm.toLowerCase();
        const cropMatch = item.crop?.toLowerCase().includes(q);
        const diseaseMatch = item.disease?.toLowerCase().includes(q);
        const severityMatch = item.severity?.toLowerCase().includes(q);
        const statusMatch = item.isHealthy ? "healthy".includes(q) : "disease".includes(q);
        return cropMatch || diseaseMatch || severityMatch || statusMatch;
    });

    // Calculate healthy vs diseased counts
    const healthyCount = diseaseHistory.filter((item) => item.isHealthy).length;
    const diseasedCount = diseaseHistory.length - healthyCount;

    return (
        <main className="min-h-screen bg-slate-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full lg:w-[85%] max-w-6xl mx-auto space-y-6">
                {/* Header Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl"
                >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-3xl sm:text-4xl shadow-inner border border-white/20">
                                👨‍🌾
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                                        {user?.name || "Farmer"}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-300/30">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Active Farmer Session
                                    </span>
                                </div>
                                <p className="mt-1 text-xs sm:text-sm text-emerald-100/80">
                                    {user?.email} • Smart Agriculture AI Platform
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                className="rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition border border-white/20 cursor-pointer"
                            >
                                {isEditingProfile ? "Cancel Edit" : "✏️ Edit Profile"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-red-600/90 hover:bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition cursor-pointer"
                                title="End active session"
                            >
                                🚪 End Session
                            </button>
                        </div>
                    </div>
                </motion.div>

                {profileSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-800 text-xs sm:text-sm font-medium"
                    >
                        ✅ {profileSuccess}
                    </motion.div>
                )}

                {/* Edit Profile Form Modal/Section */}
                {isEditingProfile && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                            Update Farmer & Field Profile
                        </h2>
                        <form onSubmit={handleSaveProfile} className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Farm Location
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.farmLocation}
                                    onChange={(e) => setProfileForm({ ...profileForm, farmLocation: e.target.value })}
                                    placeholder="City / Region"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Farm Size
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.farmSize}
                                    onChange={(e) => setProfileForm({ ...profileForm, farmSize: e.target.value })}
                                    placeholder="e.g. 10 Acres"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Soil Type
                                </label>
                                <select
                                    value={profileForm.soilType}
                                    onChange={(e) => setProfileForm({ ...profileForm, soilType: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="Loamy">Loamy Soil</option>
                                    <option value="Alluvial">Alluvial Soil</option>
                                    <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                                    <option value="Red & Yellow">Red & Yellow Soil</option>
                                    <option value="Clayey">Clayey Soil</option>
                                    <option value="Sandy">Sandy Soil</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="+91..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition cursor-pointer"
                                >
                                    {savingProfile ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Info Stats Cards */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Crop Recommendations */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Crop Predictions
                            </span>
                            <span className="text-xl">🌾</span>
                        </div>
                        <p className="mt-2.5 text-2xl font-bold text-slate-900">
                            {cropHistory.length}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Soil recommendations
                        </p>
                    </div>

                    {/* Card 2: Plant Disease Diagnoses */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Disease Scans
                            </span>
                            <span className="text-xl">🩺</span>
                        </div>
                        <p className="mt-2.5 text-2xl font-bold text-slate-900">
                            {diseaseHistory.length}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                            {healthyCount} healthy • {diseasedCount} flagged
                        </p>
                    </div>

                    {/* Card 3: Farm Profile */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Farm Location
                            </span>
                            <span className="text-xl">📍</span>
                        </div>
                        <p className="mt-2.5 text-base sm:text-lg font-bold text-slate-900 truncate">
                            {user?.farmLocation || "Not Specified"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 truncate">
                            {user?.farmSize || "Size not set"}
                        </p>
                    </div>

                    {/* Card 4: Soil Classification */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Soil Type
                            </span>
                            <span className="text-xl">🧪</span>
                        </div>
                        <p className="mt-2.5 text-base sm:text-lg font-bold text-slate-900 truncate">
                            {user?.soilType || "Loamy"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Default field class
                        </p>
                    </div>
                </div>

                {/* Main History Container with Interactive Tab Navigation */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
                    {/* Tab Navigation & Search Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit border border-slate-200/80">
                            <button
                                onClick={() => setActiveTab("crops")}
                                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === "crops"
                                        ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <span>🌾</span>
                                <span>Crop Recommendations</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                        activeTab === "crops"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {cropHistory.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab("diseases")}
                                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === "diseases"
                                        ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <span>🩺</span>
                                <span>Crop Disease Diagnoses</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                        activeTab === "diseases"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {diseaseHistory.length}
                                </span>
                            </button>
                        </div>

                        {/* Search & Actions Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                            <input
                                type="text"
                                placeholder={
                                    activeTab === "crops"
                                        ? "Search by crop..."
                                        : "Search by crop or disease..."
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-56 px-3.5 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                            />

                            <div className="flex items-center gap-2">
                                {activeTab === "crops" && cropHistory.length > 0 && (
                                    <button
                                        onClick={handleClearAllCropHistory}
                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition cursor-pointer"
                                    >
                                        Clear Crops
                                    </button>
                                )}

                                {activeTab === "diseases" && diseaseHistory.length > 0 && (
                                    <button
                                        onClick={handleClearAllDiseaseHistory}
                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition cursor-pointer"
                                    >
                                        Clear Diagnoses
                                    </button>
                                )}

                                {activeTab === "crops" ? (
                                    <Link
                                        to="/recommend"
                                        className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                                    >
                                        <span>+</span> Recommend Crop
                                    </Link>
                                ) : (
                                    <Link
                                        to="/disease"
                                        className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                                    >
                                        <span>🩺</span> Scan Leaf
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TAB 1: CROP RECOMMENDATION HISTORY */}
                    {activeTab === "crops" && (
                        <div className="mt-5">
                            {loadingCrops ? (
                                <div className="py-12 text-center">
                                    <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></span>
                                    <p className="mt-3 text-xs sm:text-sm text-slate-500">
                                        Loading your crop recommendation history...
                                    </p>
                                </div>
                            ) : cropError ? (
                                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs sm:text-sm text-center">
                                    {cropError}
                                </div>
                            ) : filteredCropHistory.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="text-4xl sm:text-5xl mb-3">🌱</div>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                                        No crop recommendations found
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                                        {searchTerm
                                            ? "No past recommendations match your search term."
                                            : "You haven't run any soil crop recommendations yet. Enter your field parameters to get started!"}
                                    </p>
                                    <Link
                                        to="/recommend"
                                        className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition"
                                    >
                                        🌾 Get First Crop Recommendation
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {filteredCropHistory.map((item, index) => {
                                        const rawCrop = item.recommendedCrop || "";
                                        const isUnknown = !rawCrop || rawCrop.toLowerCase() === "unknown crop";
                                        const resolvedCrop = isUnknown
                                            ? item.topPredictions?.[0]?.crop || "Rice"
                                            : rawCrop;

                                        const cropKey = resolvedCrop.toLowerCase();
                                        const emoji = cropEmojis[cropKey] || "🌿";
                                        const formattedDate = item.createdAt
                                            ? new Date(item.createdAt).toLocaleString(undefined, {
                                                  dateStyle: "medium",
                                                  timeStyle: "short",
                                              })
                                            : "Recent";

                                        return (
                                            <motion.div
                                                key={item._id || index}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 p-4 sm:p-5 transition hover:shadow-xs"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                                                    {/* Left: Recommended Crop info */}
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-2xl sm:text-3xl shadow-2xs">
                                                            {emoji}
                                                        </span>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
                                                                    {resolvedCrop}
                                                                </h3>
                                                                {typeof item.confidence === "number" && (
                                                                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-800">
                                                                        {Math.round(item.confidence * 100)}% Confidence
                                                                    </span>
                                                                )}
                                                                <span className="text-[11px] sm:text-xs text-slate-400">
                                                                    📅 {formattedDate}
                                                                </span>
                                                            </div>

                                                            {item.explanation && (
                                                                <p className="mt-1 text-xs text-slate-600 max-w-2xl line-clamp-2">
                                                                    {item.explanation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2 self-end lg:self-center">
                                                        <Link
                                                            to="/recommend"
                                                            state={{ prefillInputs: item.inputs }}
                                                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                                                            title="Re-run recommendation with these inputs"
                                                        >
                                                            🔄 Re-test
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteCropItem(item._id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                            title="Delete record"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Inputs Parameter Badges */}
                                                {item.inputs && (
                                                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                N (Nitrogen)
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.N}{" "}
                                                                <span className="text-[10px] font-normal text-slate-500">
                                                                    mg/kg
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                P (Phosphorus)
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.P}{" "}
                                                                <span className="text-[10px] font-normal text-slate-500">
                                                                    mg/kg
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                K (Potassium)
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.K}{" "}
                                                                <span className="text-[10px] font-normal text-slate-500">
                                                                    mg/kg
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                Soil pH
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.ph}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                Temperature
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.temperature}°C
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                Humidity
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.humidity}%
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                                                            <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                                Rainfall
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {item.inputs.rainfall} mm
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: CROP DISEASE DIAGNOSIS HISTORY */}
                    {activeTab === "diseases" && (
                        <div className="mt-5">
                            {loadingDiseases ? (
                                <div className="py-12 text-center">
                                    <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></span>
                                    <p className="mt-3 text-xs sm:text-sm text-slate-500">
                                        Loading your plant disease diagnosis history...
                                    </p>
                                </div>
                            ) : diseaseError ? (
                                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs sm:text-sm text-center">
                                    {diseaseError}
                                </div>
                            ) : filteredDiseaseHistory.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="text-4xl sm:text-5xl mb-3">🩺</div>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                                        No plant disease diagnoses found
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                                        {searchTerm
                                            ? "No past diagnosis records match your search filter."
                                            : "You haven't scanned any crop leaves yet. Upload or drop a photo to detect diseases instantly!"}
                                    </p>
                                    <Link
                                        to="/disease"
                                        className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition"
                                    >
                                        🔬 Scan Leaf with AI Plant Doctor
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredDiseaseHistory.map((item, index) => {
                                        const cropKey = item.crop?.toLowerCase() || "";
                                        const emoji = diseaseCropEmojis[cropKey] || "🌿";
                                        const isExpanded = expandedDiseaseIds.has(item._id);

                                        const formattedDate = item.createdAt
                                            ? new Date(item.createdAt).toLocaleString(undefined, {
                                                  dateStyle: "medium",
                                                  timeStyle: "short",
                                              })
                                            : "Recent Scan";

                                        const confidencePercent =
                                            typeof item.confidence === "number"
                                                ? Math.round(
                                                      item.confidence <= 1
                                                          ? item.confidence * 100
                                                          : item.confidence
                                                  )
                                                : 90;

                                        return (
                                            <motion.div
                                                key={item._id || index}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                                    item.isHealthy
                                                        ? "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50"
                                                        : "border-slate-200/90 bg-white hover:bg-slate-50/60 shadow-xs"
                                                }`}
                                            >
                                                {/* Card Header Row */}
                                                <div className="p-4 sm:p-5">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                                                        {/* Left: Crop & Disease Summary */}
                                                        <div className="flex items-start gap-3.5 sm:gap-4">
                                                            <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-2xl sm:text-3xl shadow-2xs">
                                                                {emoji}
                                                            </span>
                                                            <div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                                                        {item.crop}
                                                                    </span>

                                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                                                        {item.disease}
                                                                    </h3>

                                                                    {item.isHealthy ? (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-800 border border-emerald-300">
                                                                            🌱 Healthy Plant
                                                                        </span>
                                                                    ) : (
                                                                        <span
                                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-bold border ${
                                                                                item.severity?.toLowerCase() === "high" ||
                                                                                item.severity?.toLowerCase() === "critical"
                                                                                    ? "bg-rose-100 text-rose-800 border-rose-300"
                                                                                    : item.severity?.toLowerCase() === "moderate"
                                                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                                                    : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                                                            }`}
                                                                        >
                                                                            ⚠️ {item.severity || "Moderate"} Severity
                                                                        </span>
                                                                    )}

                                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-slate-700">
                                                                        🎯 {confidencePercent}% Confidence
                                                                    </span>

                                                                    <span className="text-[11px] sm:text-xs text-slate-400">
                                                                        📅 {formattedDate}
                                                                    </span>
                                                                </div>

                                                                {item.symptoms && (
                                                                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 max-w-3xl">
                                                                        <strong>Symptoms:</strong> {item.symptoms}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right: Action Buttons */}
                                                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                                                            <button
                                                                onClick={() => toggleExpandDisease(item._id)}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                                                    isExpanded
                                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                                                }`}
                                                                title="View remedy details"
                                                            >
                                                                <span>{isExpanded ? "Hide Details" : "View Remedies"}</span>
                                                                <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                                                            </button>

                                                            <Link
                                                                to="/disease"
                                                                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                                                                title="Scan new leaf in Plant Doctor"
                                                            >
                                                                🔬 Scan Leaf
                                                            </Link>

                                                            <button
                                                                onClick={() => handleDeleteDiseaseItem(item._id)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                                                title="Delete diagnosis record"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expandable Treatment & Prevention Drawer */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="border-t border-slate-200/80 bg-slate-50/80 p-4 sm:p-6"
                                                        >
                                                            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                                                                {/* Organic Treatment */}
                                                                <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/60 p-3.5 sm:p-4">
                                                                    <div className="flex items-center gap-2 mb-1.5 text-emerald-800 font-bold text-xs sm:text-sm">
                                                                        <span>🌱</span>
                                                                        <span>Organic & Biological Control</span>
                                                                    </div>
                                                                    <p className="text-xs text-emerald-900/90 leading-relaxed">
                                                                        {item.organicTreatment ||
                                                                            "Maintain clean field conditions, prune infected debris, and ensure adequate plant spacing."}
                                                                    </p>
                                                                </div>

                                                                {/* Chemical Treatment */}
                                                                <div className="rounded-xl border border-blue-200/90 bg-blue-50/60 p-3.5 sm:p-4">
                                                                    <div className="flex items-center gap-2 mb-1.5 text-blue-800 font-bold text-xs sm:text-sm">
                                                                        <span>🧪</span>
                                                                        <span>Chemical / Fungicide Control</span>
                                                                    </div>
                                                                    <p className="text-xs text-blue-900/90 leading-relaxed">
                                                                        {item.chemicalTreatment ||
                                                                            "Apply targeted agricultural fungicides or bactericides as specified on certified crop labels."}
                                                                    </p>
                                                                </div>

                                                                {/* Preventative Measures */}
                                                                <div className="rounded-xl border border-purple-200/90 bg-purple-50/60 p-3.5 sm:p-4 sm:col-span-2 lg:col-span-1">
                                                                    <div className="flex items-center gap-2 mb-1.5 text-purple-800 font-bold text-xs sm:text-sm">
                                                                        <span>🛡️</span>
                                                                        <span>Prevention & Farm Hygiene</span>
                                                                    </div>
                                                                    <p className="text-xs text-purple-900/90 leading-relaxed">
                                                                        {item.prevention ||
                                                                            "Rotate crops annually, use certified disease-free seeds, and avoid overhead sprinkler watering on foliage."}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
