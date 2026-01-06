from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Settings, User
from app.schemas import SettingsResponse, SettingsBase
from app.security import verify_token

router = APIRouter(prefix="/settings", tags=["settings"])

def get_current_user(token: str = None, db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=SettingsResponse)
def get_settings(
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    if not settings:
        # Create default settings if not exists
        default_currency = "INR" if user.category == "Milky" else "USD"
        settings = Settings(user_id=user.id, currency=default_currency)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(
    settings_data: SettingsBase,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    if not settings:
        settings = Settings(user_id=user.id, **settings_data.dict())
        db.add(settings)
    else:
        settings.currency = settings_data.currency
        settings.usd_to_inr_rate = settings_data.usd_to_inr_rate
    
    db.commit()
    db.refresh(settings)
    return settings
