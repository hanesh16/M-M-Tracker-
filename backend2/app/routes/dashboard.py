from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Expense, Income, User, Settings
from app.schemas import DashboardSummary, RecentActivity
from app.security import verify_token
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

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

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    token: str = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db) = None
):
    user = get_current_user(token, db)
    
    now = datetime.utcnow()
    if not month:
        month = now.month
    if not year:
        year = now.year
    
    # Get expenses for the month
    expenses_query = db.query(Expense).filter(
        Expense.user_id == user.id,
        Expense.expense_date.like(f"{year:04d}-{month:02d}%")
    )
    total_expense = sum([e.amount for e in expenses_query.all()]) or 0
    
    # Get incomes for the month
    incomes_query = db.query(Income).filter(
        Income.user_id == user.id,
        Income.income_date.like(f"{year:04d}-{month:02d}%")
    )
    total_income = sum([i.amount for i in incomes_query.all()]) or 0
    
    savings = total_income - total_expense
    
    return DashboardSummary(
        totalIncome=total_income,
        totalExpense=total_expense,
        savings=savings
    )

@router.get("/recent-activity", response_model=List[RecentActivity])
def get_recent_activity(
    token: str = None,
    limit: int = 3,
    db: Session = Depends(get_db) = None
):
    user = get_current_user(token, db)
    
    # Get recent expenses
    expenses = db.query(Expense).filter(
        Expense.user_id == user.id
    ).order_by(Expense.expense_date.desc()).limit(limit).all()
    
    # Get recent incomes
    incomes = db.query(Income).filter(
        Income.user_id == user.id
    ).order_by(Income.income_date.desc()).limit(limit).all()
    
    # Combine and format
    activities = []
    
    for expense in expenses:
        activities.append(RecentActivity(
            id=expense.id,
            category=expense.category,
            amount=expense.amount,
            date=expense.expense_date,
            type="expense",
            notes=expense.notes
        ))
    
    for income in incomes:
        activities.append(RecentActivity(
            id=income.id,
            category=income.source,
            source=income.source,
            amount=income.amount,
            date=income.income_date,
            type="income",
            notes=income.notes
        ))
    
    # Sort by date descending and limit
    activities.sort(key=lambda x: x.date, reverse=True)
    return activities[:limit]
