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
    user_currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 81.0
    
    now = datetime.utcnow()
    if not month:
        month = now.month
    if not year:
        year = now.year
    
    # Get expenses for the month
    expenses_query = db.query(Expense).filter(
        Expense.user_id == user.id,
        Expense.expense_date.like(f"{year:04d}-{month:02d}%")
    ).all()
    
    # Get incomes for the month
    incomes_query = db.query(Income).filter(
        Income.user_id == user.id,
        Income.income_date.like(f"{year:04d}-{month:02d}%")
    ).all()
    
    # Smart conversion: only convert if currency doesn't match
    total_expense = 0
    for e in expenses_query:
        if e.currency == user_currency:
            total_expense += e.amount
        elif e.currency == "USD" and user_currency == "INR":
            total_expense += e.amount * rate
        elif e.currency == "INR" and user_currency == "USD":
            total_expense += e.amount / rate
    
    total_income = 0
    for i in incomes_query:
        if i.currency == user_currency:
            total_income += i.amount
        elif i.currency == "USD" and user_currency == "INR":
            total_income += i.amount * rate
        elif i.currency == "INR" and user_currency == "USD":
            total_income += i.amount / rate
    
    return DashboardSummary(
        totalIncome=total_income,
        totalExpense=total_expense,
        savings=total_income - total_expense,
        currency=user_currency
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
    user_currency = settings.currency if settings else "USD"
    rate = settings.usd_to_inr_rate if settings else 81.0
    
    # Get recent expenses
    expenses = db.query(Expense).filter(
        Expense.user_id == user.id
    ).order_by(Expense.expense_date.desc()).all()
    
    # Get recent incomes
    incomes = db.query(Income).filter(
        Income.user_id == user.id
    ).order_by(Income.income_date.desc()).all()
    
    # Combine and format with smart conversion
    activities = []
    
    for expense in expenses:
        # Smart conversion: only convert if currency doesn't match
        amount = expense.amount
        if expense.currency != user_currency:
            if expense.currency == "USD" and user_currency == "INR":
                amount = expense.amount * rate
            elif expense.currency == "INR" and user_currency == "USD":
                amount = expense.amount / rate
        
        activities.append(RecentActivity(
            id=expense.id,
            type="expense",
            title=expense.category,
            amount=amount,
            date=expense.expense_date,
            notes=expense.notes,
            currency=user_currency
        ))
    
    for income in incomes:
        # Smart conversion: only convert if currency doesn't match
        amount = income.amount
        if income.currency != user_currency:
            if income.currency == "USD" and user_currency == "INR":
                amount = income.amount * rate
            elif income.currency == "INR" and user_currency == "USD":
                amount = income.amount / rate
        
        activities.append(RecentActivity(
            id=income.id,
            type="income",
            title=income.source,
            amount=amount,
            date=income.income_date,
            notes=income.notes,
            currency=user_currency
        ))
    
    # Sort by date descending and limit
    activities.sort(key=lambda x: x.date, reverse=True)
    return activities[:limit]
