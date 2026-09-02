import { useState } from "react";
import api from "./services/api";
import "./index.css";

function App() {
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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getRecommendation = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      // Check if any field is empty
      const hasEmptyField = Object.values(formData).some(
        (value) => value === ""
      );

      if (hasEmptyField) {
        setError("Please fill in all fields.");
        return;
      }

      // Convert form values from strings to numbers
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
        "Unable to get crop recommendation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌾 Smart Agriculture AI</h1>

      <div className="card">
        <h2>Crop Recommendation</h2>
        <div className="form">
          <div className="">
            <label htmlFor="nitrogen">Nitrogen (N)</label>
            <input
              name="N"
              type="number"
              value={formData.N}
              onChange={handleChange}
              placeholder="Nitrogen (N)"
            />

            <label htmlFor="phosphorus">Phosphorus (P)</label>
            <input
              name="P"
              type="number"
              value={formData.P}
              onChange={handleChange}
              placeholder="Phosphorus (P)"
            />

            <label htmlFor="potassium">Potassium (K)</label>
            <input
              name="K"
              type="number"
              value={formData.K}
              onChange={handleChange}
              placeholder="Potassium (K)"
            />

            <label htmlFor="ph">Soil pH</label>
            <input
              name="ph"
              type="number"
              step="0.1"
              value={formData.ph}
              onChange={handleChange}
              placeholder="Soil pH"
            />
          </div>
          <div className="">
            <label htmlFor="temperature">Temperature (°C)</label>
            <input
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="Temperature (°C)"
            />

            <label htmlFor="humidity">Humidity (%)</label>
            <input
              name="humidity"
              type="number"
              step="0.1"
              value={formData.humidity}
              onChange={handleChange}
              placeholder="Humidity (%)"
            />

            <label htmlFor="rainfall">Rainfall (mm)</label>
            <input
              name="rainfall"
              type="number"
              step="0.1"
              value={formData.rainfall}
              onChange={handleChange}
              placeholder="Rainfall (mm)"
            />
          </div>
        </div>
        <button
          onClick={getRecommendation}
          disabled={loading}
        >
          {loading
            ? "Getting Recommendation..."
            : "Recommend Crop"}
        </button>
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {result && (
          <div className="result">
            <h2>Recommended Crop</h2>

            <h1>
              {result.data.crop.charAt(0).toUpperCase() + result.data.crop.slice(1)}
            </h1>

            <p>
              Confidence is{" "}
              {(
                result.data.confidence * 100
              ).toFixed(2)}
              %
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;