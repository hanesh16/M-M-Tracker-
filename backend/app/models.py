from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password_hash = Column(String)
    category = Column(String)  # Mocha or Milky
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_token_expiry = Column(DateTime, nullable=True)
    profile_picture = Column(String, nullable=True)  # Base64 or file path
    default_avatar = Column(String, nullable=True)  # pic3 for Milky, pic4 for Mocha
    created_at = Column(DateTime, default=datetime.utcnow)
    
    expenses = relationship("Expense", back_populates="owner")
    incomes = relationship("Income", back_populates="owner")
    settings = relationship("Settings", back_populates="owner", uselist=False)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String)
    amount = Column(Float)
    currency = Column(String, default="USD")  # Currency this expense was entered in
    expense_date = Column(Date)
    notes = Column(Text, nullable=True)
    expense_type = Column(String, default="additional")  # regular or additional
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="expenses")

class Income(Base):
    __tablename__ = "incomes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source = Column(String)
    amount = Column(Float)
    currency = Column(String, default="USD")  # Currency this income was entered in
    income_date = Column(Date)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="incomes")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    currency = Column(String, default="USD")
    usd_to_inr_rate = Column(Float, default=81.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="settings")

class SavingPlan(Base):
    __tablename__ = "saving_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String)
    amount = Column(Float)
    month = Column(Integer)  # 1-12
    year = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

