from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import asyncio
import logging
import os
import tempfile

from src.predict import predict_file
from database import engine, Base, get_db
import db_models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

logger = logging.getLogger("deepshield")

# Only one scan runs inference at a time. Render's free tier has 512MB RAM,
# and two PyTorch forward passes in parallel can exceed it. Extra requests
# simply wait their turn.
inference_slot = asyncio.Semaphore(1)

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(db_models.User).filter(db_models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = db_models.User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(db_models.User).filter(db_models.User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def get_me(current_user: db_models.User = Depends(get_current_user)):
    return current_user


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".mp4", ".mov", ".avi", ".webm"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Keep only the extension from the client-supplied name; never trust
    # the rest of it for building filesystem paths.
    original_name = file.filename or "upload"
    ext = os.path.splitext(original_name)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext or 'unknown'}")

    # The upload only ever lives in a temp file. The finally block below
    # deletes it on every path: success, too-large, or a model error.
    fd, tmp_path = tempfile.mkstemp(suffix=ext)
    try:
        size = 0
        with os.fdopen(fd, "wb") as tmp:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail="File too large (max 50MB)")
                tmp.write(chunk)

        # predict_file is blocking (OpenCV + PyTorch); run it in a worker
        # thread so it doesn't freeze the event loop for other requests,
        # but let only one inference run at a time to stay under the RAM cap.
        try:
            async with inference_slot:
                label, confidence = await run_in_threadpool(predict_file, tmp_path)
        except Exception:
            logger.exception("Inference failed")
            raise HTTPException(status_code=500, detail="Analysis failed. Please try another file.")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    # Decode failures come back as label "Error"; report them as an error
    # instead of saving a bogus scan to the user's history.
    if label == "Error":
        raise HTTPException(status_code=422, detail="Could not read this file. Try a different image or video.")

    # Only the result is stored: the original name (display only),
    # the label and the confidence. The upload itself is never kept.
    scan = db_models.Scan(
        user_id=current_user.id,
        filename=original_name,
        result=label,
        confidence=confidence,
    )
    db.add(scan)
    db.commit()

    return {
        "result": label,
        "confidence": confidence,
    }


@app.get("/history", response_model=list[schemas.ScanOut])
def get_history(
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    scans = (
        db.query(db_models.Scan)
        .filter(db_models.Scan.user_id == current_user.id)
        .order_by(db_models.Scan.created_at.desc())
        .all()
    )
    return scans