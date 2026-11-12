const mongoose = require("mongoose");
const dns = require("dns");

try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const atlasUri = process.env.MONGODB_URI;
    const localUri =
        process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/smart-agriculture";

    if (isProduction && !atlasUri) {
        console.error("❌ MONGODB_URI must be set in production");
        process.exit(1);
    }

    if (atlasUri) {
        try {
            console.log("🔄 Connecting to MongoDB...");
            const conn = await mongoose.connect(atlasUri, {
                serverSelectionTimeoutMS: 8000,
            });
            console.log(
                `✅ Connected to MongoDB: ${conn.connection.host} / ${conn.connection.name}`
            );
            return conn;
        } catch (atlasError) {
            console.error(`❌ MongoDB connection failed: ${atlasError.message}`);
            if (isProduction) {
                process.exit(1);
            }
        }
    }

    if (isProduction) {
        return;
    }

    try {
        const localConn = await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(
            `✅ Connected to local MongoDB: ${localConn.connection.host}:${localConn.connection.port} / ${localConn.connection.name}`
        );
        return localConn;
    } catch (localError) {
        console.error(`❌ Failed to connect to local MongoDB: ${localError.message}`);
    }
};

module.exports = connectDB;
