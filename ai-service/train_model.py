import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# --------------------------------------------------
# 1. Load dataset
# --------------------------------------------------

data = pd.read_csv("data/crop-recommendation.csv")
print("Dataset loaded")
print(f"Number of rows: {len(data)}")
print(data.head())


# --------------------------------------------------
# 2. Separate features and target
# --------------------------------------------------

X = data[
    [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall",
    ]
]

y = data["label"]


# --------------------------------------------------
# 3. Split dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)


# --------------------------------------------------
# 4. Create model
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
)


# --------------------------------------------------
# 5. Train model
# --------------------------------------------------

model.fit(X_train, y_train)

print("Model training completed")


# --------------------------------------------------
# 6. Evaluate model
# --------------------------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, predictions))


# --------------------------------------------------
# 7. Save model
# --------------------------------------------------

joblib.dump(model, "models/crop_model.joblib")

print("Model saved to models/crop_model.joblib")