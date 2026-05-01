import cv2
import os
from tqdm import tqdm

# Input and output folders
input_dirs = ['Data/real', 'Data/fake']
output_dirs = ['Frames/real', 'Frames/fake']


# Create output directories if not exist
for d in output_dirs:
    os.makedirs(d, exist_ok=True)

def extract_frames(video_path, output_folder, num_frames=10):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_interval = max(total_frames // num_frames, 1)

    count = 0
    saved = 0
    while cap.isOpened() and saved < num_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if count % frame_interval == 0:
            frame_filename = os.path.join(output_folder, f"{os.path.basename(video_path)}_{saved}.jpg")
            cv2.imwrite(frame_filename, frame)
            saved += 1
        count += 1
    cap.release()

# Process all videos
for input_dir, output_dir in zip(input_dirs, output_dirs):
    videos = [f for f in os.listdir(input_dir) if f.endswith('.mp4')]
    for video in tqdm(videos, desc=f"Processing {input_dir}"):
        video_path = os.path.join(input_dir, video)
        extract_frames(video_path, output_dir)
