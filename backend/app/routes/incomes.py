from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Income, User, Settings
from app.schemas import IncomeCreate, IncomeResponse
from app.security import verify_token
from app.currency_utils import convert_amount
from typing import List, Optional

router = APIRouter(prefix="/incomes", tags=["incomes"])

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

@router.post("/", response_model=IncomeResponse)
def create_income(
    income: IncomeCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # Get settings for exchange rate
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    rate = settings.usd_to_inr_rate if settings else 81.0
    
    # Store the currency this income was entered in
    income_currency = income.currency if income.currency else "USD"
    
    db_income = Income(
        user_id=user.id,
        source=income.source,
        amount=income.amount,
        currency=income_currency,  # Store original currency
        income_date=income.income_date,
        notes=income.notes
    )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    
    response = IncomeResponse.from_orm(db_income)
    response.currency = income_currency
    response.amount = income.amount
    return response

@router.get("/", response_model=List[IncomeResponse])
def list_incomes(
    token: str = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # Get user's current currency setting
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    user_currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 81.0
    
    query = db.query(Income).filter(Income.user_id == user.id)
    
    if month and year:
        query = query.filter(
            Income.income_date.like(f"{year:04d}-{month:02d}%")
        )
    elif year:
        query = query.filter(
            Income.income_date.like(f"{year:04d}%")
        )
    
    if source:
        query = query.filter(Income.source == source)
    
    incomes = query.order_by(Income.income_date.desc()).all()
    
    # Smart conversion: Only convert if stored currency differs from user's selected currency
    result = []
    for income in incomes:
        response = IncomeResponse.from_orm(income)
        # If income was entered in different currency than user's current selection, convert
        if income.currency != user_currency:
            if income.currency == "USD" and user_currency == "INR":
                # Convert USD to INR
                response.amount = income.amount * rate
            elif income.currency == "INR" and user_currency == "USD":
                # Convert INR to USD
                response.amount = income.amount / rate
        # If same currency, no conversion needed
        response.currency = user_currency
        result.append(response)
    
    return result

@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == user.id
    ).first()
    
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    db.delete(income)
    db.commit()
    
    return {"message": "Income deleted successfully"}
