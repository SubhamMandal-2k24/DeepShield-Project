
import torch
import torch.nn.functional as F
import cv2
import numpy as np
from torchvision import transforms
from src.model import DeepFakeDetector
 
 
# =====================================
# Load Model (Load Once)
# =====================================
 
device = torch.device("cpu")
 
model = DeepFakeDetector()
model.load_state_dict(torch.load("Models/deepfake_resnet50.pth", map_location=device))
model.to(device)
model.eval()
 
 
# =====================================
# Image Transform (ResNet50 Standard)
# =====================================
 
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
 
 
# =====================================
# Video Prediction Function
# =====================================
 
def predict_video(video_path, num_frames=10):
    """
    Predict whether a video is REAL or FAKE
    Returns: (label, confidence_percentage)
 
    Uses sequential cap.read() instead of cap.set() seeking, since
    seeking to arbitrary frame positions is slow on compressed video
    (each seek can require decoding from the nearest keyframe forward).
    Sequential reads avoid that entirely and are far faster on
    low-CPU environments like Render's free tier.
    """
 
    cap = cv2.VideoCapture(video_path)
 
    if not cap.isOpened():
        return "Error", 0.0
 
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
 
    if total_frames == 0:
        cap.release()
        return "Error", 0.0
 
    # Which frame indices we actually want to sample
    target_indices = set(np.linspace(0, total_frames - 1, num_frames, dtype=int).tolist())
    max_target_idx = max(target_indices)
 
    fake_probs = []
    current_idx = 0
 
    with torch.no_grad():
        while True:
            ret, frame = cap.read()
 
            if not ret:
                break
 
            if current_idx in target_indices:
                # Convert BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
 
                # Preprocess
                input_tensor = transform(frame_rgb).unsqueeze(0).to(device)
 
                outputs = model(input_tensor)
                probs = F.softmax(outputs, dim=1)
 
                # IMPORTANT:
                # Assuming:
                # Class 0 = REAL
                # Class 1 = FAKE
                fake_prob = probs[0][1].item()
                fake_probs.append(fake_prob)
 
                # Once we've collected everything we need, stop early
                if len(fake_probs) == len(target_indices):
                    break
 
            current_idx += 1
 
            # Safety: stop reading once we've passed the last frame we need
            if current_idx > max_target_idx:
                break
 
    cap.release()
 
    if len(fake_probs) == 0:
        return "Error", 0.0
 
    # Average probability across frames
    avg_fake_prob = sum(fake_probs) / len(fake_probs)
 
    # Decide label and confidence properly
    if avg_fake_prob >= 0.5:
        label = "FAKE"
        confidence = avg_fake_prob
    else:
        label = "REAL"
        confidence = 1 - avg_fake_prob
 
    confidence_percentage = round(confidence * 100, 2)
 
    return label, confidence_percentage
 
 
# =====================================
# Universal Predict Function
# =====================================
 
def predict_file(file_path):
    """
    Accepts video path
    Returns (label, confidence)
    """
 
    label, confidence = predict_video(file_path)
    return label, confidence
 
 
# =====================================
# CLI Support
# =====================================
 
if __name__ == "__main__":
    import sys
    import json
 
    path = sys.argv[1]
    label, confidence = predict_file(path)
 
    print(json.dumps({
        "label": label,
        "confidence": confidence
    }))