const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend in express is healthy"
    });
});


app.get("/api/ai-health", async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:8000/health"
        );

        res.json(response.data);
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: "error",
            message: "AI service is unavailable"
        });
    }
});

app.post("/api/crop/recommend", async (req, res)=>{
    try {
        const response = await axios.post(
            "http://localhost:8000/predict",
            req.body
        );

        res.json(response.data)
    } catch (error) {
        console.error("AI Service Error:", error.message)

        res.status(500).json({
            status: "error",
            message: "Unable to get crop recommendation"
        })
    }
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});