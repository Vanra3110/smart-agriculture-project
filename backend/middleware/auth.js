const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Required Auth Middleware
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized. No session token provided.",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "default_jwt_secret_dev"
        );
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User session expired or user not found.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({
            status: "error",
            message: "Session expired or invalid token. Please log in again.",
        });
    }
};

// Optional Auth Middleware (attaches req.user if valid token provided)
const optionalAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "default_jwt_secret_dev"
            );
            req.user = await User.findById(decoded.id).select("-password");
        } catch {
            // Token invalid or expired, continue as guest
            req.user = null;
        }
    } else {
        req.user = null;
    }

    next();
};

module.exports = { protect, optionalAuth };
