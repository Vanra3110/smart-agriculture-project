from fastapi import FastAPI

from schemas import CropInput
from services.crop_service import predict_crop

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