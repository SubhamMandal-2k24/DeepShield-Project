import os
import cv2
import torch
from torchvision import transforms
from PIL import Image

# ✅ Preprocessing (same as training/predict)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# -------------------------
# 1. Ensure directory exists
# -------------------------
def ensure_dir(path):
    """Create directory if it doesn’t exist."""
    if not os.path.exists(path):
        os.makedirs(path)

# -------------------------
# 2. Extract frames from video
# -------------------------
def extract_frames(video_path, output_dir, num_frames=10):
    """
    Extract frames from a video and save them to output_dir.
    """
    ensure_dir(output_dir)
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, frame_count // num_frames)

    saved = 0
    for i in range(0, frame_count, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret:
            continue
        filename = os.path.join(output_dir, f"frame_{i}.jpg")
        cv2.imwrite(filename, frame)
        saved += 1
    cap.release()
    return saved

# -------------------------
# 3. Image preprocessing
# -------------------------
def preprocess_image(image_path):
    """
    Load an image and apply transforms.
    """
    image = Image.open(image_path).convert("RGB")
    return transform(image).unsqueeze(0)

# -------------------------
# 4. Accuracy calculation
# -------------------------
def calculate_accuracy(outputs, labels):
    """
    Compute batch accuracy.
    """
    _, preds = torch.max(outputs, 1)
    correct = (preds == labels).sum().item()
    return correct / labels.size(0)

# -------------------------
# 5. Save & load model helpers
# -------------------------
def save_model(model, path="deepfake_detector.pth"):
    torch.save(model.state_dict(), path)
    print(f"✅ Model saved to {path}")

def load_model(model_class, path="deepfake_detector.pth"):
    model = model_class()
    model.load_state_dict(torch.load(path, map_location="cpu"))
    model.eval()
    print(f"✅ Model loaded from {path}")
    return model
