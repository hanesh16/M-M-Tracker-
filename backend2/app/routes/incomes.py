from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Income, User
from app.schemas import IncomeCreate, IncomeResponse
from app.security import verify_token
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
    return db_income

@router.get("/", response_model=List[IncomeResponse])
def list_incomes(
    token: str = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db) = None
):
    user = get_current_user(token, db)
    
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
    
    return query.order_by(Income.income_date.desc()).all()

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
