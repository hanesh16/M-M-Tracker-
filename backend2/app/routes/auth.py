from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Settings
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.security import (
    get_password_hash, verify_password, create_access_token,
    create_verification_token, verify_verification_token, verify_token
)
from datetime import datetime, timedelta
from pydantic import EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=dict)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create verification token
    verification_token = create_verification_token(user_data.email)
    verification_token_expiry = datetime.utcnow() + timedelta(hours=24)
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        category=user_data.category,
        verification_token=verification_token,
        verification_token_expiry=verification_token_expiry,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default settings based on category
    default_currency = "INR" if user_data.category == "Milky" else "USD"
    settings = Settings(
        user_id=db_user.id,
        currency=default_currency
    )
    db.add(settings)
    db.commit()
    
    # Print verification link in console (dev mode)
    verification_link = f"http://localhost:3000/verify?token={verification_token}"
    print(f"\n{'='*60}")
    print(f"VERIFICATION EMAIL (DEV MODE - Console)")
    print(f"{'='*60}")
    print(f"User: {user_data.email}")
    print(f"Verification Link: {verification_link}")
    print(f"Token: {verification_token}")
    print(f"Expires: {verification_token_expiry}")
    print(f"{'='*60}\n")
    
    return {
        "message": "User created successfully. Check console for verification link.",
        "user_id": db_user.id,
        "email": db_user.email
    }

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_verification_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expiry = None
    db.commit()
    
    return {"message": "Email verified successfully. You can now login."}

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Check console for verification link.")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str = None, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
