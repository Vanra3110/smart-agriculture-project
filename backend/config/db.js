const mongoose = require("mongoose");
const dns = require("dns");

// Ensure public DNS fallback for SRV resolution
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    const atlasUri =
        process.env.MONGODB_URI ||
        "mongodb+srv://arnav3110:Arnav%233110@cluster0.chf970o.mongodb.net/TheEntranceDB?appName=Cluster0";
    const localUri =
        process.env.MONGODB_LOCAL_URI ||
        "mongodb://127.0.0.1:27017/TheEntranceDB";

    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(atlasUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(
            `✅ Connected to MongoDB Atlas: ${conn.connection.host} / Database: ${conn.connection.name}`
        );
        return conn;
    } catch (atlasError) {
        console.warn(
            `⚠️ MongoDB Atlas connection notice: ${atlasError.message}`
        );
        console.log(
            "💡 Note: Free tier Atlas clusters may be paused if inactive. Attempting connection to local MongoDB (TheEntranceDB)..."
        );

        try {
            const localConn = await mongoose.connect(localUri, {
                serverSelectionTimeoutMS: 3000,
            });
            console.log(
                `✅ Connected to local MongoDB: ${localConn.connection.host}:${localConn.connection.port} / Database: ${localConn.connection.name}`
            );
            return localConn;
        } catch (localError) {
            console.error(
                `❌ Failed to connect to both Atlas and Local MongoDB: ${localError.message}`
            );
        }
    }
};

module.exports = connectDB;
