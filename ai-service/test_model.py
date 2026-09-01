import joblib


model = joblib.load("models/crop_model.joblib")


sample = [[
    90,
    42,
    43,
    21.5,
    82,
    6.5,
    202
]]


prediction = model.predict(sample)[0]

probabilities = model.predict_proba(sample)[0]

classes = model.classes_

confidence = probabilities.max()

print("Recommended crop:", prediction)
print(f"Confidence: {confidence:.2%}")