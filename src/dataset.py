# src/dataset.py
import os
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

class DeepFakeDataset(Dataset):
    """
    Expects root_dir to be like:
      frames/train/
        ├── real/   (images)
        └── fake/   (images)
    or frames/val/ similarly.
    """
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.samples = []

        for label, clsname in enumerate(["real", "fake"]):  # 0=real, 1=fake
            class_dir = os.path.join(root_dir, clsname)
            if not os.path.exists(class_dir):
                continue
            for fname in os.listdir(class_dir):
                if fname.lower().endswith((".jpg", ".jpeg", ".png")):
                    self.samples.append((os.path.join(class_dir, fname), label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        img = Image.open(path).convert("RGB")     # PIL image in RGB
        if self.transform:
            img = self.transform(img)             # apply torchvision transforms -> tensor (C,H,W)
        return img, torch.tensor(label, dtype=torch.long)

def get_dataloader(root_dir, batch_size=8, img_size=224, shuffle=True, num_workers=0):
    transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
    ])

    dataset = DeepFakeDataset(root_dir=root_dir, transform=transform)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle, num_workers=num_workers)
    return dataloader, dataset

# Quick test when running this file directly
if __name__ == "__main__":
    print("Testing dataset loader with frames/train ...")
    dl, ds = get_dataloader("frames/train", batch_size=4, num_workers=0)
    print("Total samples:", len(ds))
    batch = next(iter(dl))
    images, labels = batch
    print("Batch images shape:", images.shape)   # expected e.g. [4, 3, 224, 224]
    print("Batch labels:", labels)
