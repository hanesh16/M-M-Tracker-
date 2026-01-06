from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    category: str  # Mocha or Milky

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_verified: bool
    profile_picture: Optional[str] = None
    default_avatar: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_picture: Optional[str] = None

# Expense schemas
class ExpenseBase(BaseModel):
    category: str
    amount: float
    expense_date: date
    notes: Optional[str] = None
    expense_type: str = "additional"

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    currency: str = "USD"
    
    class Config:
        from_attributes = True

# Income schemas
class IncomeBase(BaseModel):
    source: str
    amount: float
    income_date: date
    notes: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    user_id: int
    created_at: datetime
    currency: str = "USD"
    
    class Config:
        from_attributes = True

# Settings schemas
class SettingsBase(BaseModel):
    currency: str = "USD"
    usd_to_inr_rate: float = 83.0

class SettingsCreate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardSummary(BaseModel):
    totalIncome: float
    totalExpense: float
    savings: float
    currency: str = "USD"

class RecentActivity(BaseModel):
    id: int
    type: str  # expense or income
    title: str  # category for expense, source for income
    amount: float
    date: date
    notes: Optional[str] = None
    currency: str = "USD"

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Saving Plan schemas
class SavingPlanBase(BaseModel):
    category: str
    amount: float
    month: int
    year: int

class SavingPlanCreate(SavingPlanBase):
    pass

class SavingPlanResponse(SavingPlanBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SavingPlanSummary(BaseModel):
    month: int
    year: int
    total_planned: float
    count: int
