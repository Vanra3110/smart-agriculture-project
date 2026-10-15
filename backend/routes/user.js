const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/user/history
// @desc    Get logged-in user's crop detail history
router.get("/history", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("cropHistory");
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        // Return history sorted latest first and ensure recommendedCrop is never "Unknown Crop"
        const history = [...user.cropHistory]
            .map((item) => {
                const doc = item.toObject ? item.toObject() : { ...item };
                if (!doc.recommendedCrop || doc.recommendedCrop.toLowerCase() === "unknown crop") {
                    doc.recommendedCrop =
                        doc.topPredictions?.[0]?.crop ||
                        doc.topPredictions?.[0]?.name ||
                        "Rice";
                }
                return doc;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.json({
            status: "success",
            count: history.length,
            history,
        });
    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch crop recommendation history.",
        });
    }
});

// @route   POST /api/user/history
// @desc    Add a crop recommendation/prediction result to user's history
router.post("/history", protect, async (req, res) => {
    try {
        const {
            inputs,
            recommendedCrop,
            crop,
            confidence,
            explanation,
            topPredictions,
            probabilities,
            notes,
        } = req.body;

        const cropName =
            recommendedCrop ||
            crop ||
            req.body.data?.crop ||
            req.body.data?.recommended_crop ||
            (Array.isArray(topPredictions) && topPredictions[0]?.crop) ||
            "Rice";

        if (!inputs) {
            return res.status(400).json({
                status: "error",
                message: "Missing inputs data for crop recommendation.",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        const newRecord = {
            inputs: {
                N: Number(inputs.N) || 0,
                P: Number(inputs.P) || 0,
                K: Number(inputs.K) || 0,
                temperature: Number(inputs.temperature) || 0,
                humidity: Number(inputs.humidity) || 0,
                ph: Number(inputs.ph) || 0,
                rainfall: Number(inputs.rainfall) || 0,
            },
            recommendedCrop: cropName,
            confidence: typeof confidence === "number" ? confidence : undefined,
            explanation: explanation || "",
            topPredictions: Array.isArray(topPredictions)
                ? topPredictions
                : Array.isArray(probabilities)
                ? probabilities
                : [],
            notes: notes || "",
            createdAt: new Date(),
        };

        user.cropHistory.unshift(newRecord);
        await user.save();

        return res.status(201).json({
            status: "success",
            message: "Crop recommendation saved to your history!",
            item: user.cropHistory[0],
            totalRecords: user.cropHistory.length,
        });
    } catch (error) {
        console.error("Add History Error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to save crop history.",
        });
    }
});

// @route   DELETE /api/user/history/:id
// @desc    Delete a specific history item
router.delete("/history/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        const initialLength = user.cropHistory.length;
        user.cropHistory = user.cropHistory.filter(
            (item) => item._id.toString() !== req.params.id
        );

        if (user.cropHistory.length === initialLength) {
            return res.status(404).json({
                status: "error",
                message: "History entry not found.",
            });
        }

        await user.save();

        return res.json({
            status: "success",
            message: "History entry deleted successfully.",
        });
    } catch (error) {
        console.error("Delete History Item Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete history item.",
        });
    }
});

// @route   DELETE /api/user/history
// @desc    Clear all crop history for user
router.delete("/history", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        user.cropHistory = [];
        await user.save();

        return res.json({
            status: "success",
            message: "All crop history records cleared.",
        });
    } catch (error) {
        console.error("Clear History Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to clear crop history.",
        });
    }
});

// @route   GET /api/user/disease-history
// @desc    Get logged-in user's plant disease diagnosis history
router.get("/disease-history", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("diseaseHistory");
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        const history = [...(user.diseaseHistory || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.json({
            status: "success",
            count: history.length,
            history,
        });
    } catch (error) {
        console.error("Get Disease History Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch disease diagnosis history.",
        });
    }
});

// @route   DELETE /api/user/disease-history
// @desc    Clear all disease diagnosis records for user
router.delete("/disease-history", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        user.diseaseHistory = [];
        await user.save();

        return res.json({
            status: "success",
            message: "All disease diagnosis records cleared.",
        });
    } catch (error) {
        console.error("Clear Disease History Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to clear disease history.",
        });
    }
});

// @route   DELETE /api/user/disease-history/:id
// @desc    Delete a specific disease diagnosis history item
router.delete("/disease-history/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        user.diseaseHistory = (user.diseaseHistory || []).filter(
            (item) => item._id.toString() !== req.params.id
        );

        await user.save();

        return res.json({
            status: "success",
            message: "Disease history record deleted.",
        });
    } catch (error) {
        console.error("Delete Disease History Item Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete disease history item.",
        });
    }
});

module.exports = router;
