import { useState } from "react";
import api from "../../services/api";

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
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-bold tracking-widest text-green-600">
                    AI-POWERED AGRICULTURE
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Smart Agriculture AI
                </h1>

                <p className="mx-auto mt-4 w-full max-w-4xl text-lg leading-8 text-slate-600">
                    Enter your soil and environmental conditions
                    to get an AI-powered crop recommendation.
                </p>
            </section>

            <section className="text-2xl font-bold text-slate-900">
                <h2>Crop Recommendation</h2>

                <p className="mt-2 text-slate-500">
                    Enter the current conditions of your
                    agricultural field.
                </p>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-900">Soil Information</h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-900">Environmental Conditions</h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="
                    mt-8
                    w-full
                    rounded-xl
                    bg-green-600
                    px-6 py-3.5
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-green-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    "
                    onClick={getRecommendation}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing..."
                        : "🌾 Recommend Crop"}
                </button>

                {error && (
                    <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}
            </section>

            {result && <RecommendationResult result={result} />}
        </main>
    );
}

export default Home;