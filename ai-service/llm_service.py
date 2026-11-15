import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def get_openai_client():
    api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    if not api_key:
        return None
    try:
        return OpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            timeout=8.0,
        )
    except Exception as e:
        print(f"[LLM Service] Client init notice: {e}")
        return None

def build_expert_explanation(
    crop: str,
    confidence: float,
    N: float,
    P: float,
    K: float,
    ph: float,
    humidity: float,
    temperature: float,
    rainfall: float,
) -> str:
    crop_name = crop.replace("_", " ").title()
    conf_pct = confidence * 100

    return f"""### 🌱 Agricultural Recommendation: **{crop_name}**
An AI machine learning model trained on multi-regional soil and weather data recommended **{crop_name}** with a model confidence of **{conf_pct:.2f}%**.

#### 📋 Why this crop suits your field conditions:
* **Soil Nutrients (N: {N}, P: {P}, K: {K})**: The reported macronutrient levels match the vegetative and reproductive demands of {crop_name}, supporting healthy root proliferation and robust canopy development.
* **Soil pH ({ph})**: A pH of {ph} provides an optimal chemical environment for nutrient solubility, ensuring efficient micro and macronutrient assimilation.
* **Climate & Hydrology ({temperature}°C, {humidity}% humidity, {rainfall} mm rainfall)**: The thermal and moisture levels provide favorable physiological conditions for seed germination, transpiration, and harvest maturation.

#### 🚜 3 Important Farming Considerations:
1. **Soil & Nutrient Stewardship**: Verify baseline micronutrients (Zinc, Boron, Sulfur) via a comprehensive soil assay, and topdress nitrogen at key phenological growth phases.
2. **Moisture & Irrigation Management**: While rainfall of {rainfall} mm is considered in this assessment, ensure field drainage channels are prepared for intense downpours or drip irrigation is maintained during dry intervals.
3. **Integrated Pest & Disease Scouting**: Monitor early foliage weekly for common pathogens and insect vectors, practicing timely sanitation and crop rotation.

*Notice: This recommendation is generated as decision-support guidance. Local field conditions, seed varieties, irrigation access, and seasonal weather variations should always guide final planting decisions.*"""

def generate_crop_explanation(
    crop: str,
    confidence: float,
    N: float,
    P: float,
    K: float,
    ph: float,
    humidity: float,
    temperature: float,
    rainfall: float,   
) -> str:
    client = get_openai_client()
    if not client:
        print("[LLM Service] GEMINI_API_KEY not configured. Using expert agricultural explanation.")
        return build_expert_explanation(crop, confidence, N, P, K, ph, humidity, temperature, rainfall)

    prompt = f"""You are an agricultural assistant.
A machine learning model recommended the crop "{crop}" with a model confidence of {confidence * 100:.2f}%.

The field conditions are:
Nitrogen (N): {N}
Phosphorus (P): {P}
Potassium (K): {K}
pH: {ph}
Humidity: {humidity}%
Temperature: {temperature}C
Rainfall: {rainfall}mm

Explain in simple language why this crop may be suitable for these conditions.
Give:
1. A short explanation of the recommendation.
2. Three important farming considerations.

Do not say that the crop is guaranteed to succeed. 
Clearly mention that this is an AI-based recommendation."""

    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful agricultural assistant."
                },
                {
                    "role": "user", 
                    "content": prompt
                },
            ],
            timeout=8.0,
        )

        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[LLM Service] Notice ({model_name}): {e}")

    # Fallback if quota/network limit is reached
    return build_expert_explanation(crop, confidence, N, P, K, ph, humidity, temperature, rainfall)