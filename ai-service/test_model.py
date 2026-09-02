import joblib
import pandas as pd

model = joblib.load("models/crop_model.joblib")


# sample = [{
#     90,
#     42,
#     43,
#     21.5,
#     82,
#     6.5,
#     202
# ]]

sample = pd.DataFrame({
    "N":[60],
    "P":[45],
    "K":[40],
    "temperature":[25.5],
    "humidity":[65],
    "ph":[6.5],
    "rainfall":[100]
})

sample_dataset = pd.DataFrame({
    "N": [90, 20, 107, 10, 40],
    "P": [42, 60, 21, 15, 67],
    "K": [43, 80, 50, 50, 201],
    "temperature": [20.8, 18.5, 25.9, 27.2, 24.1],
    "humidity": [82.0, 48.2, 71.4, 31.5, 80.3],
    "ph": [6.50, 5.85, 6.92, 7.10, 6.30],
    "rainfall": [202.9, 90.1, 102.5, 42.0, 110.2],
})

actual_values = pd.DataFrame({
    "label": ["rice", "chickpea", "watermelon", "mothbeans", "apple"]
})

for i,_ in enumerate(actual_values["label"]):
    prediction = model.predict(sample_dataset)[i]

    probabilities = model.predict_proba(sample_dataset)[i]

    classes = model.classes_

    confidence = probabilities.max()

    print("Recommended crop:", prediction)
    print(f"Confidence: {confidence:.2%}")