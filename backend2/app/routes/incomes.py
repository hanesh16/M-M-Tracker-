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
    
    # Get user's currency for response
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    currency = settings.currency if settings else "USD"
    
    db_income = Income(
        user_id=user.id,
        source=income.source,
        amount=income.amount,
        income_date=income.income_date,
        notes=income.notes
    )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    
    # Return with converted amount
    rate = settings.usd_to_inr_rate if settings else 83.0
    converted_amount = convert_amount(db_income.amount, "USD", currency, rate)
    
    response = IncomeResponse.from_orm(db_income)
    response.currency = currency
    response.amount = converted_amount
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
    
    # Get user's currency
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 83.0
    
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
    
    # Convert amounts and add currency to response
    result = []
    for income in incomes:
        converted_amount = convert_amount(income.amount, "USD", currency, rate)
        response = IncomeResponse.from_orm(income)
        response.currency = currency
        response.amount = converted_amount
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
