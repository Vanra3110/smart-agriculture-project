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

        const data = {
            N: Number(formData.N),
            P: Number(formData.P),
            K: Number(formData.K),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall),
        }

        const hasInvalidNumber = Object.values(data).some(
            (value) => Number.isNaN(value)
        );

        if (hasInvalidNumber) {
            setError("Please enter valid numbers in all fields.")
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/crop/recommend",
                data
            );

            setResult(response.data);
        } catch (error) {
            console.error(error);

            const message = error.response?.data?.message || "Unable to get crop recommendation. Please try again."
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

            {/* Hero Section */}
            <section className="mx-auto max-w-4xl text-center">

                <p className="text-sm font-bold tracking-widest text-green-600">
                    AI-POWERED AGRICULTURE
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Smart Agriculture AI
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Enter your soil and environmental conditions
                    to get an AI-powered crop recommendation.
                </p>

            </section>

            {/* Input Form */}
            <section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Crop Recommendation
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Enter the current conditions of your agricultural field.
                    </p>
                </div>

                {/* Soil Information */}
                <div className="mt-8">

                    <h3 className="text-lg font-semibold text-slate-900">
                        Soil Information
                    </h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <InputField
                            label="Nitrogen (N)"
                            name="N"
                            value={formData.N}
                            onChange={handleChange}
                            placeholder="e.g. 90"
                            min="0"
                            unit="mg/kg"
                            hint="Available nitrogen in the soil"
                        />

                        <InputField
                            label="Phosphorus (P)"
                            name="P"
                            value={formData.P}
                            onChange={handleChange}
                            placeholder="e.g. 42"
                            min="0"
                            unit="mg/kg"
                            hint="Available phosphorus in the soil"
                        />

                        <InputField
                            label="Potassium (K)"
                            name="K"
                            value={formData.K}
                            onChange={handleChange}
                            placeholder="e.g. 43"
                            min="0"
                            unit="mg/kg"
                            hint="Available potassium in the soil"
                        />

                        <InputField
                            label="Soil pH"
                            name="ph"
                            value={formData.ph}
                            onChange={handleChange}
                            placeholder="e.g. 6.5"
                            step="0.1"
                            min="0"
                            max="14"
                            hint="Soil pH level"
                        />

                    </div>

                </div>

                {/* Environmental Conditions */}
                <div className="mt-8">

                    <h3 className="text-lg font-semibold text-slate-900">
                        Environmental Conditions
                    </h3>

                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        <InputField
                            label="Temperature (°C)"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="e.g. 21.5"
                            step="0.1"
                            min="-50"
                            max="60"
                            unit="°C"
                            hint="Current field temperature"
                        />

                        <InputField
                            label="Humidity (%)"
                            name="humidity"
                            value={formData.humidity}
                            onChange={handleChange}
                            placeholder="e.g. 82"
                            step="0.1"
                            min="0"
                            max="100"
                            unit="%"
                            hint="Relative humidity level"
                        />

                        <InputField
                            label="Rainfall (mm)"
                            name="rainfall"
                            value={formData.rainfall}
                            onChange={handleChange}
                            placeholder="e.g. 202"
                            step="0.1"
                            min="0"
                            unit="mm"
                            hint="Rainfall amount"
                        />

                    </div>

                </div>

                <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                    Enter measured or estimated field conditions for the best
                    possible recommendation.
                </p>

                {/* Button */}
                <button
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={getRecommendation}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Analyzing...
                        </>
                    ) : (
                        "🌾 Recommend Crop"
                    )}
                </button>

                {/* Error */}
                {error && (
                    <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}

            </section>

            {/* Recommendation */}
            <RecommendationResult result={result} />

        </main>
    );
}

export default Home;