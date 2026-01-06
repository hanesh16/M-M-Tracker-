from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Expense, Income, User, Settings
from app.schemas import DashboardSummary, RecentActivity
from app.security import verify_token
from app.currency_utils import convert_amount
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
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # Get user's currency setting
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 83.0
    
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
    
    # Convert to user's currency (amounts are stored in USD)
    converted_expense = convert_amount(total_expense, "USD", currency, rate)
    converted_income = convert_amount(total_income, "USD", currency, rate)
    converted_savings = converted_income - converted_expense
    
    return DashboardSummary(
        totalIncome=converted_income,
        totalExpense=converted_expense,
        savings=converted_savings,
        currency=currency
    )

@router.get("/recent-activity", response_model=List[RecentActivity])
def get_recent_activity(
    token: str = None,
    limit: int = 3,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    # Get user's currency setting
    settings = db.query(Settings).filter(Settings.user_id == user.id).first()
    currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 83.0
    
    # Get recent expenses
    expenses = db.query(Expense).filter(
        Expense.user_id == user.id
    ).order_by(Expense.expense_date.desc()).all()
    
    # Get recent incomes
    incomes = db.query(Income).filter(
        Income.user_id == user.id
    ).order_by(Income.income_date.desc()).all()
    
    # Combine and format
    activities = []
    
    for expense in expenses:
        converted_amount = convert_amount(expense.amount, "USD", currency, rate)
        activities.append(RecentActivity(
            id=expense.id,
            type="expense",
            title=expense.category,
            amount=converted_amount,
            date=expense.expense_date,
            notes=expense.notes,
            currency=currency
        ))
    
    for income in incomes:
        converted_amount = convert_amount(income.amount, "USD", currency, rate)
        activities.append(RecentActivity(
            id=income.id,
            type="income",
            title=income.source,
            amount=converted_amount,
            date=income.income_date,
            notes=income.notes,
            currency=currency
        ))
    
    # Sort by date descending and limit
    activities.sort(key=lambda x: x.date, reverse=True)
    return activities[:limit]
