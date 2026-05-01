import os, shutil, random

def split_dataset(src_real, src_fake, dest_root, split_ratio=0.8):
    for label in ["real", "fake"]:
        src_dir = src_real if label == "real" else src_fake
        all_files = os.listdir(src_dir)
        random.shuffle(all_files)
        
        split_point = int(len(all_files) * split_ratio)
        train_files = all_files[:split_point]
        val_files = all_files[split_point:]
        
        # Create destination dirs
        os.makedirs(os.path.join(dest_root, "train", label), exist_ok=True)
        os.makedirs(os.path.join(dest_root, "val", label), exist_ok=True)
        
        # Copy files
        for f in train_files:
            shutil.move(os.path.join(src_dir, f), os.path.join(dest_root, "train", label, f))
        for f in val_files:
            shutil.move(os.path.join(src_dir, f), os.path.join(dest_root, "val", label, f))
        
        print(f"Moved {len(train_files)} {label} images to train and {len(val_files)} to val.")

# Paths
src_real = "frames/real"
src_fake = "frames/fake"
dest_root = "frames"

split_dataset(src_real, src_fake, dest_root, split_ratio=0.8)
