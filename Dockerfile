# DeepShield backend — Render deployment
FROM python:3.11-slim

# System dependencies required by opencv-python (headless graphics libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (better Docker layer caching)
COPY requirements.txt .

# Install CPU-only torch/torchvision/torchaudio explicitly (smaller, no CUDA)
# then the rest of requirements.txt
RUN pip install --no-cache-dir torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 \
    --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Render provides the PORT env var dynamically; default to 8000 for local testing
ENV PORT=8000
EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port $PORT