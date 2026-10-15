import os
import sys
import json
import time
import glob
import random
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support

# Seed for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

DATA_DIR = r"d:\Smart-agriculture-project\Plant_Images"
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")
MODELS_DIR = r"d:\Smart-agriculture-project\ai-service\models"
METRICS_DIR = r"d:\Smart-agriculture-project\ai-service\evaluation"
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(METRICS_DIR, exist_ok=True)

MODEL_SAVE_PATH = os.path.join(MODELS_DIR, "plant_disease_resnet50.pth")
CLASSES_JSON_PATH = os.path.join(MODELS_DIR, "disease_classes.json")

# Load disease class metadata
with open(CLASSES_JSON_PATH, "r", encoding="utf-8") as f:
    disease_classes_meta = json.load(f)

NUM_CLASSES = len(disease_classes_meta)
print(f"Loaded {NUM_CLASSES} disease classes.")

# Custom Dataset that loads images by file path
class PlantDiseaseDataset(Dataset):
    def __init__(self, samples, transform=None):
        self.samples = samples  # list of (image_path, class_id)
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            image = Image.open(path).convert("RGB")
        except Exception as e:
            # Fallback for corrupted image
            image = Image.new("RGB", (224, 224), (0, 0, 0))
        if self.transform:
            image = self.transform(image)
        return image, label

def collect_samples(base_dir, max_per_class=None):
    samples = []
    for cid in range(NUM_CLASSES):
        folder = os.path.join(base_dir, str(cid))
        if not os.path.exists(folder):
            continue
        files = [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if max_per_class and len(files) > max_per_class:
            random.shuffle(files)
            files = files[:max_per_class]
        for f in files:
            samples.append((f, cid))
    return samples

print("Collecting dataset samples...")
# To keep CPU training fast and accurate, sample 25 images per class for training and 10 for validation
train_raw_samples = collect_samples(TRAIN_DIR, max_per_class=35)
random.shuffle(train_raw_samples)

# 80-20 Train-Val split
split_idx = int(len(train_raw_samples) * 0.8)
train_samples = train_raw_samples[:split_idx]
val_samples = train_raw_samples[split_idx:]

# Test set: sample 10 per class from test folder
test_samples = collect_samples(TEST_DIR, max_per_class=10)

print(f"Dataset split: Train={len(train_samples)}, Val={len(val_samples)}, Test={len(test_samples)}")

# Image Preprocessing & Augmentation Pipeline (ResNet50 Standard)
# ResNet50 requires 224x224 RGB normalized with ImageNet mean and std
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.15, contrast=0.15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

eval_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

train_dataset = PlantDiseaseDataset(train_samples, transform=train_transform)
val_dataset = PlantDiseaseDataset(val_samples, transform=eval_transform)
test_dataset = PlantDiseaseDataset(test_samples, transform=eval_transform)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=0)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=0)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=0)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using compute device: {device}")

# Build ResNet50 Model with Transfer Learning
print("Loading pretrained ResNet50 with ImageNet weights...")
weights = models.ResNet50_Weights.DEFAULT
model = models.resnet50(weights=weights)

# Freeze backbone layers initially
for param in model.parameters():
    param.requires_grad = False

# Replace classification head with custom layers matching project spec:
# Pretrained ResNet50 -> Global Average Pooling -> Dropout -> Dense Classification -> Softmax
in_features = model.fc.in_features  # 2048
model.fc = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(in_features, 512),
    nn.ReLU(),
    nn.Dropout(p=0.2),
    nn.Linear(512, NUM_CLASSES)
)

model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)

# Training loop with Early Stopping & Best Checkpoint Tracking
num_epochs = 8
history = {
    "train_loss": [],
    "train_acc": [],
    "val_loss": [],
    "val_acc": []
}

best_val_acc = 0.0
best_model_state = None

print("\n--- Starting Phase 5: Initial Training (Frozen Backbone) ---")
start_time = time.time()

for epoch in range(num_epochs):
    epoch_start = time.time()
    
    # Training
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        
    epoch_train_loss = running_loss / total
    epoch_train_acc = correct / total
    
    # Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)
            
    epoch_val_loss = val_loss / val_total
    epoch_val_acc = val_correct / val_total
    
    history["train_loss"].append(epoch_train_loss)
    history["train_acc"].append(epoch_train_acc)
    history["val_loss"].append(epoch_val_loss)
    history["val_acc"].append(epoch_val_acc)
    
    if epoch_val_acc > best_val_acc:
        best_val_acc = epoch_val_acc
        best_model_state = model.state_dict().copy()
        
    elapsed = time.time() - epoch_start
    print(f"Epoch [{epoch+1}/{num_epochs}] ({elapsed:.1f}s) - "
          f"Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc*100:.2f}% | "
          f"Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc*100:.2f}%")

# Fine-tuning upper ResNet50 layers (layer4) with low learning rate
print("\n--- Phase 5 (Cont.): Fine-tuning Layer 4 with Low LR ---")
for param in model.layer4.parameters():
    param.requires_grad = True

ft_optimizer = optim.Adam([
    {"params": model.layer4.parameters(), "lr": 1e-4},
    {"params": model.fc.parameters(), "lr": 3e-4}
])

ft_epochs = 3
for epoch in range(ft_epochs):
    epoch_start = time.time()
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        ft_optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        ft_optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        
    epoch_train_loss = running_loss / total
    epoch_train_acc = correct / total
    
    # Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)
            
    epoch_val_loss = val_loss / val_total
    epoch_val_acc = val_correct / val_total
    
    history["train_loss"].append(epoch_train_loss)
    history["train_acc"].append(epoch_train_acc)
    history["val_loss"].append(epoch_val_loss)
    history["val_acc"].append(epoch_val_acc)
    
    if epoch_val_acc >= best_val_acc:
        best_val_acc = epoch_val_acc
        best_model_state = model.state_dict().copy()
        
    elapsed = time.time() - epoch_start
    print(f"Fine-tune Epoch [{epoch+1}/{ft_epochs}] ({elapsed:.1f}s) - "
          f"Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc*100:.2f}% | "
          f"Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc*100:.2f}%")

total_train_time = time.time() - start_time
print(f"\nTraining completed in {total_train_time/60:.2f} minutes. Best Validation Accuracy: {best_val_acc*100:.2f}%")

# Load best checkpoint
if best_model_state:
    model.load_state_dict(best_model_state)

# Save the trained model
torch.save(model.state_dict(), MODEL_SAVE_PATH)
print(f"Saved trained ResNet50 model weights to {MODEL_SAVE_PATH}")

# Phase 6: Model Evaluation on unseen test images
print("\n--- Starting Phase 6: Model Evaluation on Unseen Test Set ---")
model.eval()
all_preds = []
all_targets = []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_targets.extend(labels.numpy())

all_preds = np.array(all_preds)
all_targets = np.array(all_targets)

test_acc = accuracy_score(all_targets, all_preds)
precision, recall, f1, _ = precision_recall_fscore_support(all_targets, all_preds, average='weighted', zero_division=0)

print(f"Test Set Evaluation Results:")
print(f"Accuracy:  {test_acc * 100:.2f}%")
print(f"Precision: {precision * 100:.2f}%")
print(f"Recall:    {recall * 100:.2f}%")
print(f"F1-Score:  {f1 * 100:.2f}%")

# Save classification report and metrics
target_names = [disease_classes_meta[str(i)]["raw_name"] for i in range(NUM_CLASSES)]
clf_report = classification_report(all_targets, all_preds, target_names=target_names, output_dict=True, zero_division=0)

eval_summary = {
    "model": "ResNet50",
    "num_classes": NUM_CLASSES,
    "input_resolution": "224x224x3",
    "test_accuracy": float(test_acc),
    "test_precision": float(precision),
    "test_recall": float(recall),
    "test_f1_score": float(f1),
    "total_test_samples": int(len(all_targets)),
    "classification_report": clf_report,
    "training_history": history
}

with open(os.path.join(METRICS_DIR, "eval_metrics.json"), "w", encoding="utf-8") as f:
    json.dump(eval_summary, f, indent=2)

# Generate and save Training & Validation Curves Plot
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(range(1, len(history["train_acc"]) + 1), [a * 100 for a in history["train_acc"]], 'o-', label='Training Accuracy', color='#16a34a')
plt.plot(range(1, len(history["val_acc"]) + 1), [a * 100 for a in history["val_acc"]], 's--', label='Validation Accuracy', color='#0284c7')
plt.title('ResNet50 Accuracy vs. Epochs', fontsize=12, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Accuracy (%)')
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(range(1, len(history["train_loss"]) + 1), history["train_loss"], 'o-', label='Training Loss', color='#dc2626')
plt.plot(range(1, len(history["val_loss"]) + 1), history["val_loss"], 's--', label='Validation Loss', color='#f59e0b')
plt.title('ResNet50 Loss vs. Epochs', fontsize=12, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Categorical Cross-Entropy Loss')
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend()

plt.tight_layout()
curve_path = os.path.join(METRICS_DIR, "eval_training_curves.png")
plt.savefig(curve_path, dpi=200)
plt.close()
print(f"Saved training curves plot to {curve_path}")

# Generate and save Confusion Matrix Plot
cm = confusion_matrix(all_targets, all_preds)
plt.figure(figsize=(14, 12))
plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Greens)
plt.title(f'ResNet50 Confusion Matrix (38 Crop Disease Classes)\nOverall Test Accuracy: {test_acc*100:.2f}%', fontsize=14, fontweight='bold')
plt.colorbar()
tick_marks = np.arange(NUM_CLASSES)
short_labels = [disease_classes_meta[str(i)]["raw_name"][:16] for i in range(NUM_CLASSES)]
plt.xticks(tick_marks, short_labels, rotation=90, fontsize=7)
plt.yticks(tick_marks, short_labels, fontsize=7)
plt.xlabel('Predicted Class', fontsize=11, fontweight='bold')
plt.ylabel('True Class', fontsize=11, fontweight='bold')
plt.tight_layout()
cm_path = os.path.join(METRICS_DIR, "eval_confusion_matrix.png")
plt.savefig(cm_path, dpi=200)
plt.close()
print(f"Saved confusion matrix plot to {cm_path}")

# Phase 7: Verification with unseen sample image
print("\n--- Starting Phase 7: Prediction Pipeline Smoke Test ---")
sample_img_path, sample_target = test_samples[0]
sample_img = Image.open(sample_img_path).convert("RGB")
tensor_img = eval_transform(sample_img).unsqueeze(0).to(device)

model.eval()
with torch.no_grad():
    sample_out = model(tensor_img)
    probs = torch.softmax(sample_out, dim=1)[0]
    conf, pred_id = torch.max(probs, dim=0)

print(f"Sample test image: {sample_img_path}")
print(f"True Class: {disease_classes_meta[str(sample_target)]['raw_name']}")
print(f"Predicted Class: {disease_classes_meta[str(pred_id.item())]['raw_name']}")
print(f"Confidence: {conf.item()*100:.2f}%")
print("\n=== Model training and evaluation successfully finished! ===")
