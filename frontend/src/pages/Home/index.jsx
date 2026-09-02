import { useState } from "react";
import api from "../../services/api";

import "../../App.css";

import InputField from "../../components/InputField";
import RecommendationResult from "../../components/Recommendation";

function Home() {
    const [formData, setFormData] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const getRecommendation = async () => {
        setError("");
        setResult(null);

        const hasEmptyField = Object.values(formData).some(
            (value) => value === ""
        );

        if (hasEmptyField) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);

            const data = {
                N: Number(formData.N),
                P: Number(formData.P),
                K: Number(formData.K),
                temperature: Number(formData.temperature),
                humidity: Number(formData.humidity),
                ph: Number(formData.ph),
                rainfall: Number(formData.rainfall),
            };

            const response = await api.post(
                "/crop/recommend",
                data
            );

            setResult(response.data);
        } catch (error) {
            console.error(error);

            setError(
                "Unable to get crop recommendation. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="app">
            <section className="hero">
                <p className="eyebrow">
                    AI-POWERED AGRICULTURE
                </p>

                <h1>Smart Agriculture AI</h1>

                <p>
                    Enter your soil and environmental
                    conditions to get a crop recommendation.
                </p>
            </section>

            <section className="form-card">
                <h2>Crop Recommendation</h2>

                <p className="section-description">
                    Enter the current conditions of your
                    agricultural field.
                </p>

                <div className="section">
                    <h3>Soil Information</h3>

                    <div className="input-grid">
                        <InputField
                            label="Nitrogen (N)"
                            name="N"
                            value={formData.N}
                            onChange={handleChange}
                            placeholder="e.g. 90"
                        />

                        <InputField
                            label="Phosphorus (P)"
                            name="P"
                            value={formData.P}
                            onChange={handleChange}
                            placeholder="e.g. 42"
                        />

                        <InputField
                            label="Potassium (K)"
                            name="K"
                            value={formData.K}
                            onChange={handleChange}
                            placeholder="e.g. 43"
                        />

                        <InputField
                            label="Soil pH"
                            name="ph"
                            value={formData.ph}
                            onChange={handleChange}
                            placeholder="e.g. 6.5"
                            step="0.1"
                        />
                    </div>
                </div>

                <div className="section">
                    <h3>Environmental Conditions</h3>

                    <div className="input-grid">
                        <InputField
                            label="Temperature (°C)"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="e.g. 21.5"
                            step="0.1"
                        />

                        <InputField
                            label="Humidity (%)"
                            name="humidity"
                            value={formData.humidity}
                            onChange={handleChange}
                            placeholder="e.g. 82"
                            step="0.1"
                        />

                        <InputField
                            label="Rainfall (mm)"
                            name="rainfall"
                            value={formData.rainfall}
                            onChange={handleChange}
                            placeholder="e.g. 202"
                            step="0.1"
                        />
                    </div>
                </div>

                <button
                    className="recommend-button"
                    onClick={getRecommendation}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing..."
                        : "🌾 Recommend Crop"}
                </button>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}
            </section>

            <RecommendationResult result={result} />
        </main>
    );
}

export default Home;