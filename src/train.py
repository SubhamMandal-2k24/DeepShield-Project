# src/train.py
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from dataset import DeepFakeDataset, get_dataloader
from model import DeepFakeDetector
from tqdm import tqdm

# --------------------
# Hyperparameters
# --------------------
BATCH_SIZE = 8        # reduce if you get OOM
EPOCHS = 3            # start small for test; increase later
LR = 1e-4
IMG_SIZE = 224
NUM_WORKERS = 0       # use 0 on Windows; change if you know what you're doing
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAVE_PATH = "models"
SAVE_NAME = "deepfake_resnet50.pth"

os.makedirs(SAVE_PATH, exist_ok=True)

# --------------------
# Datasets + loaders
# --------------------
train_loader, train_ds = get_dataloader("frames/train", batch_size=BATCH_SIZE, img_size=IMG_SIZE, shuffle=True, num_workers=NUM_WORKERS)
val_loader, val_ds     = get_dataloader("frames/val",   batch_size=BATCH_SIZE, img_size=IMG_SIZE, shuffle=False, num_workers=NUM_WORKERS)

print(f"Train samples: {len(train_ds)}, Val samples: {len(val_ds)}")
assert len(train_ds) > 0, "Train dataset is empty — check frames/train folder"
assert len(val_ds) > 0, "Val dataset is empty — check frames/val folder"

# --------------------
# Model, loss, opt
# --------------------
model = DeepFakeDetector().to(DEVICE)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

# --------------------
# Training loop
# --------------------
for epoch in range(1, EPOCHS + 1):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    loop = tqdm(train_loader, desc=f"Epoch {epoch}/{EPOCHS}")
    for images, labels in loop:
        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        outputs = model(images)                  # forward
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

        loop.set_postfix(loss=loss.item())

    train_loss = running_loss / len(train_loader)
    train_acc = 100.0 * correct / total if total > 0 else 0.0

    # Validation
    model.eval()
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)
            outputs = model(images)
            preds = outputs.argmax(dim=1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)
    val_acc = 100.0 * val_correct / val_total if val_total > 0 else 0.0

    print(f"Epoch {epoch}/{EPOCHS} -> Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%, Val Acc: {val_acc:.2f}%")

# Save trained weights
save_file = os.path.join(SAVE_PATH, SAVE_NAME)
torch.save(model.state_dict(), save_file)
print(f"Training finished successfully. Model saved to: {save_file}")

