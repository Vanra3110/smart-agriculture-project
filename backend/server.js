require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { optionalAuth } = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Connect to MongoDB Atlas (with local fallback)
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend Express server is healthy and running",
        timestamp: new Date(),
    });
});

// AI Service Health check
app.get("/api/ai-health", async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/health`);
        res.json(response.data);
    } catch (error) {
        console.error("AI Health Error:", error.message);
        res.status(500).json({
            status: "error",
            message: "AI service is unavailable",
        });
    }
});

// Predict endpoint
app.post("/api/crop/predict", async (req, res) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/predict`,
            req.body
        );
        res.json(response.data);
    } catch (error) {
        console.error("AI Service Predict Error:", error.message);
        res.status(500).json({
            status: "error",
            message: "Unable to get crop prediction",
        });
    }
});

// Crop recommend endpoint (with optional user history saving if authenticated)
app.post("/api/crop/recommend", optionalAuth, async (req, res) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/recommend`,
            req.body
        );

        const resultData = response.data;
        const cropData = resultData?.data || resultData;

        // If user is logged in, automatically save this recommendation to crop history
        if (req.user) {
            try {
                const user = req.user;
                const recCrop =
                    cropData?.crop ||
                    cropData?.recommended_crop ||
                    cropData?.prediction ||
                    resultData?.crop ||
                    resultData?.recommended_crop ||
                    resultData?.prediction ||
                    "Rice";

                const conf =
                    typeof cropData?.confidence === "number"
                        ? cropData.confidence
                        : typeof resultData?.confidence === "number"
                        ? resultData.confidence
                        : undefined;

                const expl =
                    cropData?.explanation ||
                    cropData?.reason ||
                    resultData?.explanation ||
                    resultData?.reason ||
                    "";

                const topPreds = Array.isArray(cropData?.probabilities)
                    ? cropData.probabilities
                    : Array.isArray(cropData?.top_predictions)
                    ? cropData.top_predictions
                    : Array.isArray(resultData?.probabilities)
                    ? resultData.probabilities
                    : [];

                user.cropHistory.unshift({
                    inputs: {
                        N: Number(req.body.N) || 0,
                        P: Number(req.body.P) || 0,
                        K: Number(req.body.K) || 0,
                        temperature: Number(req.body.temperature) || 0,
                        humidity: Number(req.body.humidity) || 0,
                        ph: Number(req.body.ph) || 0,
                        rainfall: Number(req.body.rainfall) || 0,
                    },
                    recommendedCrop: recCrop,
                    confidence: conf,
                    explanation: expl,
                    topPredictions: topPreds,
                    createdAt: new Date(),
                });
                await user.save();
                resultData.savedToHistory = true;
            } catch (historyErr) {
                console.error("Auto-save crop history failed:", historyErr.message);
            }
        }

        res.json(resultData);
    } catch (error) {
        console.error(
            "AI Service Error:",
            error.response?.data || error.message
        );

        if (error.response) {
            return res.status(error.response.status).json({
                status: "error",
                message:
                    error.response.data?.detail ||
                    "Invalid crop recommendation request",
            });
        }

        res.status(503).json({
            status: "error",
            message: "AI service is unavailable",
        });
    }
});

// Multer memory storage configuration for leaf image uploads
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Disease Predict endpoint (ResNet50 AI pipeline)
app.post("/api/disease/predict", optionalAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Please upload a crop leaf image (JPG, PNG).",
            });
        }

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], {
            type: req.file.mimetype || "image/jpeg",
        });
        formData.append("file", blob, req.file.originalname || "leaf.jpg");

        const response = await axios.post(
            `${AI_SERVICE_URL}/predict/disease`,
            formData
        );
        const resultData = response.data;
        const diseaseData = resultData?.data || resultData;

        // Auto-save to user profile history if logged in
        if (req.user && diseaseData?.crop) {
            try {
                const user = req.user;
                if (!user.diseaseHistory) {
                    user.diseaseHistory = [];
                }
                user.diseaseHistory.unshift({
                    crop: diseaseData.crop,
                    disease: diseaseData.disease,
                    isHealthy: Boolean(diseaseData.is_healthy),
                    confidence: diseaseData.confidence,
                    severity: diseaseData.severity || "Moderate",
                    symptoms: diseaseData.symptoms || "",
                    organicTreatment: diseaseData.organic_treatment || "",
                    chemicalTreatment: diseaseData.chemical_treatment || "",
                    prevention: diseaseData.prevention || "",
                    createdAt: new Date(),
                });
                await user.save();
                resultData.savedToHistory = true;
            } catch (histErr) {
                console.error("Auto-save disease history failed:", histErr.message);
            }
        }

        res.json(resultData);
    } catch (error) {
        console.error("Disease prediction error:", error.response?.data || error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                status: "error",
                message:
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    "Failed to analyze leaf image",
            });
        }
        res.status(503).json({
            status: "error",
            message: "AI disease detection service is temporarily unavailable",
        });
    }
});

// Disease classes listing endpoint
app.get("/api/disease/classes", async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/disease/classes`);
        res.json(response.data);
    } catch (error) {
        res.status(503).json({
            status: "error",
            message: "Could not retrieve disease categories",
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});