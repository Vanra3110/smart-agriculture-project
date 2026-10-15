import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const PRESET_SAMPLES = [
    {
        id: "apple_scab",
        name: "Apple Scab",
        crop: "Apple",
        type: "Fungal Disease",
        src: "/sample_leaves/apple_scab.jpg",
    },
    {
        id: "corn_rust",
        name: "Corn Rust",
        crop: "Corn",
        type: "Fungal Rust",
        src: "/sample_leaves/corn_rust.jpg",
    },
    {
        id: "potato_early_blight",
        name: "Potato Blight",
        crop: "Potato",
        type: "Foliar Blight",
        src: "/sample_leaves/potato_early_blight.jpg",
    },
    {
        id: "tomato_bacterial_spot",
        name: "Tomato Bacterial Spot",
        crop: "Tomato",
        type: "Bacterial Infection",
        src: "/sample_leaves/tomato_bacterial_spot.jpg",
    },
    {
        id: "tomato_healthy",
        name: "Healthy Tomato",
        crop: "Tomato",
        type: "Healthy Foliage",
        src: "/sample_leaves/tomato_healthy.jpg",
    },
    {
        id: "corn_healthy",
        name: "Healthy Corn",
        crop: "Corn",
        type: "Healthy Foliage",
        src: "/sample_leaves/corn_healthy.jpg",
    },
];

export default function DiseaseDetection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("symptoms");
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);

    // Handle file selection from local device
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            loadFile(file);
        }
    };

    const loadFile = (file) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file (JPG, PNG).");
            return;
        }
        setError(null);
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setResult(null);
    };

    // Load sample preset image
    const handleSelectPreset = async (preset) => {
        try {
            setError(null);
            setResult(null);
            setImagePreview(preset.src);

            const res = await fetch(preset.src);
            const blob = await res.blob();
            const file = new File([blob], `${preset.id}.jpg`, { type: "image/jpeg" });
            setSelectedImage(file);
        } catch (err) {
            setError("Could not load preset sample image.");
        }
    };

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadFile(e.dataTransfer.files[0]);
        }
    };

    // Execute prediction API call
    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError("Please select or drop a leaf image first.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("image", selectedImage);

        // Include auth token if user is signed in
        const token = localStorage.getItem("agri_token") || localStorage.getItem("token");
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await axios.post(`${API_BASE}/disease/predict`, formData, {
                headers,
            });

            if (response.data?.status === "success" || response.data?.data) {
                setResult(response.data.data || response.data);
            } else {
                setError(response.data?.message || "Failed to analyze image.");
            }
        } catch (err) {
            console.error("Diagnosis error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Failed to connect to the disease detection AI engine. Ensure AI service is running."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-emerald-50/60 via-slate-50 to-white pt-16 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                
                {/* Header */}
                <div className="text-center mb-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-3 shadow-xs"
                    >
                        <span>🔬 ResNet50 Deep Learning Engine</span>
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Crop Disease Detection & Diagnosis
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                        Identify plant diseases and leaf anomalies in seconds with neural vision.
                        Get immediate agronomic symptoms, organic treatments, and preventative remedies.
                    </p>
                </div>

                {/* Preset Sample Leaf Picker */}
                <div className="mb-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            ⚡ Quick Test with Sample Leaves
                        </span>
                        <span className="text-xs text-emerald-600 font-medium hidden sm:inline">
                            Click any sample to test immediately
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                        {PRESET_SAMPLES.map((sample) => (
                            <button
                                key={sample.id}
                                onClick={() => handleSelectPreset(sample)}
                                className={`group flex flex-col items-center p-2 rounded-xl border text-center transition cursor-pointer ${
                                    imagePreview === sample.src
                                        ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30"
                                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                                }`}
                            >
                                <img
                                    src={sample.src}
                                    alt={sample.name}
                                    className="w-14 h-14 object-cover rounded-lg mb-1.5 shadow-2xs group-hover:scale-105 transition duration-200"
                                />
                                <span className="text-xs font-semibold text-slate-800 truncate w-full">
                                    {sample.crop}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate w-full">
                                    {sample.name.replace(sample.crop, "").trim()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Upload Column (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>📸</span> Upload Leaf Image
                            </h2>

                            {/* Dropzone */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] overflow-hidden ${
                                    dragActive
                                        ? "border-emerald-500 bg-emerald-50/60"
                                        : imagePreview
                                        ? "border-slate-300 bg-slate-900/5 hover:border-emerald-400"
                                        : "border-slate-300 hover:border-emerald-400 bg-slate-50/60"
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <div className="relative w-full h-48 flex items-center justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Leaf preview"
                                            className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
                                        />

                                        {/* Scanning animation laser effect when loading */}
                                        {loading && (
                                            <motion.div
                                                animate={{ top: ["0%", "95%", "0%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] z-20"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl shadow-2xs">
                                            🌿
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Drag & drop a crop leaf image here
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            or click to browse from device (JPG, PNG)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex gap-2.5">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!selectedImage || loading}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                                        !selectedImage || loading
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            <span>Analyzing with ResNet50...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🔍 Diagnose Crop Leaf</span>
                                        </>
                                    )}
                                </button>

                                {imagePreview && (
                                    <button
                                        onClick={handleReset}
                                        disabled={loading}
                                        className="px-3.5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-medium transition cursor-pointer"
                                        title="Clear and reset image"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Error notification */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                                >
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Model Specs Card */}
                        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                                🧠 Deep Learning Architecture
                            </h3>
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-400">Backbone:</span>
                                    <span className="font-semibold text-white">ResNet50 (Residual Network)</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-400">Transfer Learning:</span>
                                    <span className="font-semibold text-emerald-300">ImageNet Pretrained Weights</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-400">Input Size:</span>
                                    <span className="font-semibold text-white">224 × 224 RGB</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-400">Classes:</span>
                                    <span className="font-semibold text-white">38 Crop Disease Categories</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Regularization:</span>
                                    <span className="font-semibold text-white">Dropout (0.3) + Augmentation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Results Column (7 cols) */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Primary Diagnosis Card */}
                                    <div className={`rounded-2xl p-6 border shadow-xs transition ${
                                        result.is_healthy
                                            ? "bg-linear-to-br from-emerald-50 via-teal-50 to-white border-emerald-200"
                                            : "bg-linear-to-br from-rose-50/70 via-amber-50/50 to-white border-amber-200"
                                    }`}>
                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2">
                                                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-bold shadow-2xs ${
                                                    result.is_healthy
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-rose-600 text-white"
                                                }`}>
                                                    {result.is_healthy ? "✓" : "!"}
                                                </span>
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                        result.is_healthy
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-rose-100 text-rose-800"
                                                    }`}>
                                                        {result.is_healthy ? "Healthy Plant" : "Pathogen Detected"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Severity Tag */}
                                            {!result.is_healthy && (
                                                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                                                    <span>Severity:</span>
                                                    <span className="font-bold">{result.severity || "Moderate"}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Crop & Disease Headline */}
                                        <div className="mb-4">
                                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wide">
                                                Host Crop: <span className="text-slate-900">{result.crop}</span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                                                {result.disease}
                                            </h2>
                                        </div>

                                        {/* Confidence Gauge */}
                                        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-slate-200/80">
                                            <div className="flex justify-between items-center text-xs mb-1.5">
                                                <span className="font-semibold text-slate-600">Model Prediction Confidence</span>
                                                <span className="font-extrabold text-emerald-700 text-sm">
                                                    {result.confidence}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    className={`h-2.5 rounded-full ${
                                                        result.confidence > 80
                                                            ? "bg-emerald-600"
                                                            : result.confidence > 50
                                                            ? "bg-amber-500"
                                                            : "bg-rose-500"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agronomic Recommendations Tabs */}
                                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                                        {/* Tab Headers */}
                                        <div className="flex border-b border-slate-200 pb-2 gap-2 overflow-x-auto">
                                            <button
                                                onClick={() => setActiveTab("symptoms")}
                                                className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                                                    activeTab === "symptoms"
                                                        ? "border-emerald-600 text-emerald-700"
                                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                                }`}
                                            >
                                                🔍 Symptoms
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("organic")}
                                                className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                                                    activeTab === "organic"
                                                        ? "border-emerald-600 text-emerald-700"
                                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                                }`}
                                            >
                                                🌿 Organic Remedies
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("chemical")}
                                                className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                                                    activeTab === "chemical"
                                                        ? "border-emerald-600 text-emerald-700"
                                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                                }`}
                                            >
                                                🧪 Chemical Control
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("prevention")}
                                                className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                                                    activeTab === "prevention"
                                                        ? "border-emerald-600 text-emerald-700"
                                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                                }`}
                                            >
                                                🛡️ Prevention
                                            </button>
                                        </div>

                                        {/* Tab Content */}
                                        <div className="pt-4 text-sm text-slate-700 leading-relaxed min-h-[110px]">
                                            {activeTab === "symptoms" && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <p className="font-medium text-slate-800 mb-1">Key Diagnostic Indicators:</p>
                                                    <p className="text-slate-600">{result.symptoms || "No visible lesion symptoms registered for this class."}</p>
                                                </motion.div>
                                            )}

                                            {activeTab === "organic" && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <p className="font-medium text-emerald-800 mb-1">Bio-Safe & Organic Solutions:</p>
                                                    <p className="text-slate-600">{result.organic_treatment || "Maintain organic compost mulch and healthy irrigation."}</p>
                                                </motion.div>
                                            )}

                                            {activeTab === "chemical" && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <p className="font-medium text-rose-800 mb-1">Recommended Fungicide / Bactericide Treatments:</p>
                                                    <p className="text-slate-600">{result.chemical_treatment || "No chemical application necessary for healthy specimens."}</p>
                                                </motion.div>
                                            )}

                                            {activeTab === "prevention" && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <p className="font-medium text-slate-800 mb-1">Preventative Cultural Practices:</p>
                                                    <p className="text-slate-600">{result.prevention || "Implement routine crop rotation, sanitize tools, and prune crowded leaves."}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Top 5 Probability Breakdown */}
                                    {Array.isArray(result.top_predictions) && result.top_predictions.length > 0 && (
                                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                                📊 Neural Probability Distribution (Top Candidates)
                                            </h3>
                                            <div className="space-y-2.5">
                                                {result.top_predictions.map((pred, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="font-medium text-slate-700">
                                                                {pred.crop} - {pred.disease}
                                                            </span>
                                                            <span className="font-bold text-slate-900">
                                                                {pred.confidence}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-1.5 rounded-full ${
                                                                    i === 0 ? "bg-emerald-500" : "bg-slate-400"
                                                                }`}
                                                                style={{ width: `${pred.confidence}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-8 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl text-emerald-600 mb-3 shadow-2xs">
                                        🌱
                                    </div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        No Image Analyzed Yet
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                                        Select a sample leaf from the top quick-bar or upload a photo to start AI neural diagnosis.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>
        </div>
    );
}
