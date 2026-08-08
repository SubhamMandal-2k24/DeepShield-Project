from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import shutil
import os

from src.predict import predict_file
from database import engine, Base, get_db
import db_models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: db_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    label, confidence = predict_file(file_location)

    # Save permanently in user's folder
    user_folder = f"uploads/user_{current_user.id}"
    os.makedirs(user_folder, exist_ok=True)
    permanent_path = os.path.join(user_folder, file.filename)
    shutil.copy(file_location, permanent_path)

    os.remove(file_location)

    # Log to database
    scan = db_models.Scan(
        user_id=current_user.id,
        filename=file.filename,
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