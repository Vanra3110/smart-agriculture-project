import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from schemas import CropInput
from services.crop_service import predict_crop
from services.disease_service import predict_crop_disease, get_disease_classes
from llm_service import generate_crop_explanation

app = FastAPI(
    title="Smart Agriculture AI",
    description="AI service for smart agriculture applications",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {
        "status": "success",
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
    probabilities = prediction_result["probabilities"]

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
            "probabilities": probabilities,
        },
    }

@app.post("/predict/disease")
async def detect_plant_disease(file: UploadFile = File(...)):
    """
    Accepts an uploaded crop leaf image and classifies disease using trained ResNet50.
    """
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty image file uploaded")

        result = predict_crop_disease(contents)
        return {
            "status": "success",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Inference error: {str(e)}"}
        )

@app.get("/disease/classes")
def list_disease_classes():
    """
    Returns the list of 38 crop disease categories supported by the ResNet50 model.
    """
    classes = get_disease_classes()
    return {
        "status": "success",
        "count": len(classes),
        "data": list(classes.values())
    }
