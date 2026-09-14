# 🌾 Smart Agriculture AI

An AI-powered full-stack application that recommends a suitable crop based on soil and environmental conditions.

The project combines a **Random Forest machine-learning model** for crop prediction with **Gemini AI** for generating a simple explanation of the recommendation.

---

## 📌 Project Overview

Smart Agriculture AI takes the following field conditions as input:

- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- Soil pH
- Rainfall

The input is sent through a full-stack application:

```text
React Frontend
      ↓
Express Backend
      ↓
FastAPI AI Service
      ↓
Random Forest Model
      ↓
Gemini AI Explanation
      ↓
Recommendation