import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");

  const checkBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/health"
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🌾 Smart Agriculture AI</h1>
        <p>AI-powered farming recommendations</p>
      </header>

      <main>
        <section className="card">
          <h2>Backend Connection Test</h2>

          <button onClick={checkBackend}>
            Check Backend
          </button>

          {message && <p>{message}</p>}
        </section>
      </main>
    </div>
  );
}

export default App;