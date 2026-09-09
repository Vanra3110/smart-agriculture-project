import joblib
import pandas as pd

from schemas import CropInput

MODEL_PATH = "./models/crop_model.joblib"

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

    for crop, probability in zip(model.classes_, probabilities):
        print(f"{crop}: {probability * 100:.2f}%")

    return {
        "crop": prediction,
        "confidence": round(float(confidence),4),
    }
