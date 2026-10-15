import os
import io
import json
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

MODEL_PATH = r"d:\Smart-agriculture-project\ai-service\models\plant_disease_resnet50.pth"
CLASSES_JSON_PATH = r"d:\Smart-agriculture-project\ai-service\models\disease_classes.json"

_model = None
_disease_classes = None

def get_disease_classes():
    global _disease_classes
    if _disease_classes is None:
        if os.path.exists(CLASSES_JSON_PATH):
            with open(CLASSES_JSON_PATH, "r", encoding="utf-8") as f:
                _disease_classes = json.load(f)
        else:
            _disease_classes = {}
    return _disease_classes

def get_disease_model():
    global _model
    if _model is not None:
        return _model

    classes = get_disease_classes()
    num_classes = len(classes) if classes else 38

    # Build ResNet50 model structure
    model = models.resnet50(weights=None)
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes)
    )

    if os.path.exists(MODEL_PATH):
        try:
            state_dict = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
            model.load_state_dict(state_dict)
            model.eval()
            _model = model
            print(f"[Disease Service] Successfully loaded ResNet50 weights from {MODEL_PATH}")
        except Exception as e:
            print(f"[Disease Service] Error loading weights: {e}")
            _model = model
            _model.eval()
    else:
        print(f"[Disease Service] Model weights not found yet at {MODEL_PATH}. Using initialized backbone.")
        model.eval()
        _model = model

    return _model

# Standard ResNet50 inference preprocessing transform
inference_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def predict_crop_disease(image_bytes: bytes):
    """
    Accepts raw image bytes, runs through ResNet50 classifier,
    and returns rich disease prediction results and remedies.
    """
    classes = get_disease_classes()
    model = get_disease_model()

    # If the model file exists now but wasn't loaded with weights, reload it
    if os.path.exists(MODEL_PATH) and _model is not None:
        pass

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid or corrupted image format: {str(e)}")

    # Preprocess
    tensor_img = inference_transform(image).unsqueeze(0)

    # Model inference
    with torch.no_grad():
        outputs = model(tensor_img)
        probs = torch.softmax(outputs, dim=1)[0]
        top_k = min(5, len(probs))
        top_probs, top_indices = torch.topk(probs, k=top_k)

    top_probs = top_probs.cpu().numpy()
    top_indices = top_indices.cpu().numpy()

    top_idx = int(top_indices[0])
    confidence = float(top_probs[0])

    meta = classes.get(str(top_idx), {
        "class_id": top_idx,
        "raw_name": f"Class_{top_idx}",
        "crop": "Unknown",
        "disease": "Detected Leaf Anomaly",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Leaf discoloration or morphological changes detected.",
        "organic_treatment": "Apply organic bio-fungicide or neem spray.",
        "chemical_treatment": "Consult local agricultural extension office for targeted fungicide.",
        "prevention": "Sanitize tools, practice crop rotation, and avoid overhead watering."
    })

    # Build top candidate breakdown
    candidates = []
    for p, idx in zip(top_probs, top_indices):
        c_meta = classes.get(str(int(idx)), {})
        candidates.append({
            "class_id": int(idx),
            "crop": c_meta.get("crop", "Unknown"),
            "disease": c_meta.get("disease", "Unknown"),
            "confidence": round(float(p) * 100, 2),
            "is_healthy": c_meta.get("is_healthy", False),
            "raw_name": c_meta.get("raw_name", "")
        })

    return {
        "predicted_class_id": top_idx,
        "raw_name": meta.get("raw_name", ""),
        "crop": meta.get("crop", "Unknown"),
        "disease": meta.get("disease", "Unknown"),
        "is_healthy": meta.get("is_healthy", False),
        "confidence": round(confidence * 100, 2),
        "severity": meta.get("severity", "None" if meta.get("is_healthy") else "Moderate"),
        "symptoms": meta.get("symptoms", ""),
        "organic_treatment": meta.get("organic_treatment", ""),
        "chemical_treatment": meta.get("chemical_treatment", ""),
        "prevention": meta.get("prevention", ""),
        "top_predictions": candidates
    }
