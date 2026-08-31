from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import shutil
import os
import uuid
import tempfile

from src.predict import predict_file
from database import engine, Base, get_db
import db_models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    # Generate our own safe on-disk name (also fixes the old collision bug,
    # where two users uploading "video.mp4" at once shared one temp file).
    safe_name = f"{uuid.uuid4().hex}{ext}"

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        size = 0
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_FILE_SIZE:
                tmp.close()
                os.remove(tmp.name)
                raise HTTPException(status_code=413, detail="File too large (max 50MB)")
            tmp.write(chunk)
        file_location = tmp.name

    try:
        label, confidence = predict_file(file_location)

        # Save permanently in user's folder, under our generated safe name
        user_folder = os.path.join("uploads", f"user_{current_user.id}")
        os.makedirs(user_folder, exist_ok=True)
        permanent_path = os.path.join(user_folder, safe_name)
        shutil.copy(file_location, permanent_path)
    finally:
        os.remove(file_location)

    # Log to database — original_name is stored only for display, never
    # used to build a filesystem path
    scan = db_models.Scan(
        user_id=current_user.id,
        filename=original_name,
        file_path=permanent_path,
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