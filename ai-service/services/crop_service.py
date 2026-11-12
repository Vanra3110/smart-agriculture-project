from pathlib import Path

import joblib
import pandas as pd

from schemas import CropInput

SERVICE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = SERVICE_DIR / "models" / "crop_model.joblib"

model = joblib.load(MODEL_PATH)

def predict_crop(data):
    input_data = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall,
    }])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    confidence = probabilities.max()

    prob_list = []
    for crop, probability in zip(model.classes_, probabilities):
        prob_list.append({
            "crop": crop,
            "probability": round(float(probability) * 100, 2)
        })

    return {
        "crop": prediction,
        "confidence": round(float(confidence), 4),
        "probabilities": prob_list,
    }
