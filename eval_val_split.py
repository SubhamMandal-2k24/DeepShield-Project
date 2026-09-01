# eval_val_split.py — run from repo root (same folder as src/, Models/, frames/)
import torch
from src.dataset import get_dataloader
from src.model import DeepFakeDetector

# 1. Rebuild the empty model architecture (same shape as when it was trained)
model = DeepFakeDetector()

# 2. Load your trained weights into it
model.load_state_dict(torch.load("Models/deepfake_resnet50.pth", map_location="cpu"))

# 3. Set to evaluation mode
model.eval()

# 4. Load the held-out validation split (20% never used in training)
val_loader, val_ds = get_dataloader("frames/val", batch_size=8, img_size=224, shuffle=False, num_workers=0)
print(f"Validation samples: {len(val_ds)}")

# 5. Run inference, no gradient tracking needed
correct, total = 0, 0
with torch.no_grad():
    for images, labels in val_loader:
        outputs = model(images)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

# 6. Report the result
val_acc = 100.0 * correct / total if total > 0 else 0.0
print(f"Validation Accuracy: {val_acc:.2f}% ({correct}/{total} correct)")