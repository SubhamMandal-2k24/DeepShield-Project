from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)   # matches users.name VARCHAR(100)
    email: EmailStr
    # bcrypt only uses the first 72 bytes, so longer passwords are rejected
    # instead of being silently truncated.
    password: str = Field(min_length=8, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ScanOut(BaseModel):
    id: int
    filename: str
    result: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True