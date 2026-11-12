const mongoose = require("mongoose");
const dns = require("dns");

// In cloud environments (Render, AWS, Railway, Docker), overriding DNS servers
// breaks the container's internal DNS resolver. Only override if explicitly requested in dev.
if (process.env.NODE_ENV !== "production" && process.env.OVERRIDE_DNS === "true") {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
        // Ignore if not supported in environment
    }
}

const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === "production";
    const atlasUri = process.env.MONGODB_URI;
    const localUri =
        process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/smart-agriculture";

    if (isProduction && !atlasUri) {
        console.error("❌ MONGODB_URI must be set in production");
        return;
    }

    if (atlasUri) {
        try {
            console.log("🔄 Connecting to MongoDB...");
            const conn = await mongoose.connect(atlasUri, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log(
                `✅ Connected to MongoDB: ${conn.connection.host} / ${conn.connection.name}`
            );
            return conn;
        } catch (atlasError) {
            console.error(`❌ MongoDB connection failed: ${atlasError.message}`);
            // Do not immediately kill the process with process.exit(1) so the web server can stay up
            // and retry, and respond to health check probes while DB reconnects.
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
