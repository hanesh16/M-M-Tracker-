from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Expense, User, Settings
from app.schemas import ExpenseCreate, ExpenseResponse
from app.security import verify_token
from datetime import date
from typing import List, Optional

router = APIRouter(prefix="/expenses", tags=["expenses"])

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

@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    db_expense = Expense(
        user_id=user.id,
        category=expense.category,
        amount=expense.amount,
        expense_date=expense.expense_date,
        notes=expense.notes,
        expense_type=expense.expense_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[ExpenseResponse])
def list_expenses(
    token: str = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    category: Optional[str] = None,
    expense_type: Optional[str] = None,
    db: Session = Depends(get_db) = None
):
    user = get_current_user(token, db)
    
    query = db.query(Expense).filter(Expense.user_id == user.id)
    
    if month and year:
        query = query.filter(
            Expense.expense_date.like(f"{year:04d}-{month:02d}%")
        )
    elif year:
        query = query.filter(
            Expense.expense_date.like(f"{year:04d}%")
        )
    
    if category:
        query = query.filter(Expense.category == category)
    
    if expense_type:
        query = query.filter(Expense.expense_type == expense_type)
    
    return query.order_by(Expense.expense_date.desc()).all()

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user.id
    ).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    
    return {"message": "Expense deleted successfully"}
