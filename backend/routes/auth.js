const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "default_jwt_secret_dev",
        { expiresIn: "7d" }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, farmLocation, farmSize, soilType, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please provide all required fields: name, email, and password.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 6 characters long.",
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "A user with this email address already exists. Please log in.",
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            farmLocation: farmLocation ? farmLocation.trim() : "",
            farmSize: farmSize ? farmSize.trim() : "",
            soilType: soilType ? soilType.trim() : "",
            phone: phone ? phone.trim() : "",
            cropHistory: [],
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            status: "success",
            message: "Account registered successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                farmLocation: user.farmLocation,
                farmSize: user.farmSize,
                soilType: user.soilType,
                phone: user.phone,
                cropHistoryCount: user.cropHistory.length,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to register account.",
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get session token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please enter both email and password.",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password.",
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user._id);

        return res.json({
            status: "success",
            message: "Logged in successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                farmLocation: user.farmLocation,
                farmSize: user.farmSize,
                soilType: user.soilType,
                phone: user.phone,
                cropHistoryCount: user.cropHistory ? user.cropHistory.length : 0,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to log in.",
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user session profile
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        return res.json({
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                farmLocation: user.farmLocation,
                farmSize: user.farmSize,
                soilType: user.soilType,
                phone: user.phone,
                cropHistoryCount: user.cropHistory ? user.cropHistory.length : 0,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Session Me Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve user profile.",
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Log out user / end session
router.post("/logout", (req, res) => {
    return res.json({
        status: "success",
        message: "Logged out successfully. Session ended.",
    });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile details
router.put("/profile", protect, async (req, res) => {
    try {
        const { name, farmLocation, farmSize, soilType, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        if (name) user.name = name.trim();
        if (farmLocation !== undefined) user.farmLocation = farmLocation.trim();
        if (farmSize !== undefined) user.farmSize = farmSize.trim();
        if (soilType !== undefined) user.soilType = soilType.trim();
        if (phone !== undefined) user.phone = phone.trim();

        await user.save();

        return res.json({
            status: "success",
            message: "Profile updated successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                farmLocation: user.farmLocation,
                farmSize: user.farmSize,
                soilType: user.soilType,
                phone: user.phone,
                cropHistoryCount: user.cropHistory ? user.cropHistory.length : 0,
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to update profile.",
        });
    }
});

module.exports = router;
