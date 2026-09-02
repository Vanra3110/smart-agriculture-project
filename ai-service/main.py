from fastapi import FastAPI

from schemas import CropInput
from services.crop_service import predict_crop
from llm_service import generate_crop_explanation

app = FastAPI(
    title="Smart Agriculture AI",
    description="AI service for smart agriculture applications",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return{
        "status":"success",
        "message": "AI Service is working properly",
    }

@app.post("/predict")
def predict(data: CropInput):

    result = predict_crop(data)

    return {
        "status": "success",
        "data": result,
    }

@app.post("/recommend")
def recommend_crop(data: CropInput):

    # Machine Learning prediction
    prediction_result = predict_crop(data)
    crop = prediction_result["crop"]
    confidence = prediction_result["confidence"]

    # Gemini explanation
    explanation = generate_crop_explanation(
        crop=crop,
        confidence=confidence,
        N=data.N,
        P=data.P,
        K=data.K,
        temperature=data.temperature,
        humidity=data.humidity,
        ph=data.ph,
        rainfall=data.rainfall,
    )

    return {
        "status": "success",
        "data": {
            "crop": crop,
            "confidence": confidence,
            "explanation": explanation,
        },
    }

