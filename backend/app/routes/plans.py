from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import SavingPlan, User
from app.schemas import SavingPlanCreate, SavingPlanResponse, SavingPlanSummary
from app.security import verify_token

router = APIRouter(prefix="/plans", tags=["saving-plans"]) 

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

@router.post("/", response_model=SavingPlanResponse)
def create_plan(plan: SavingPlanCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    db_plan = SavingPlan(
        user_id=user.id,
        category=plan.category,
        amount=plan.amount,
        month=plan.month,
        year=plan.year,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/", response_model=List[SavingPlanResponse])
def list_plans(
    token: str = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    query = db.query(SavingPlan).filter(SavingPlan.user_id == user.id)
    if month:
        query = query.filter(SavingPlan.month == month)
    if year:
        query = query.filter(SavingPlan.year == year)
    return query.order_by(SavingPlan.year.desc(), SavingPlan.month.desc(), SavingPlan.id.desc()).all()

@router.delete("/{plan_id}")
def delete_plan(plan_id: int, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    plan = db.query(SavingPlan).filter(SavingPlan.id == plan_id, SavingPlan.user_id == user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Saving plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Saving plan deleted successfully"}

@router.get("/summary", response_model=SavingPlanSummary)
def plans_summary(
    month: int,
    year: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    plans = db.query(SavingPlan).filter(
        SavingPlan.user_id == user.id,
        SavingPlan.month == month,
        SavingPlan.year == year
    ).all()
    total = sum(p.amount for p in plans)
    return SavingPlanSummary(month=month, year=year, total_planned=total, count=len(plans))
