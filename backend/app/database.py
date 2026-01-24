import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "sqlite:///./test.db"
# Use env var (cloud) or fallback to local sqlite (dev)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Render/Heroku fix: SQLAlchemy requires postgresql://, but some providers give postgres://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
# Only add check_same_thread for SQLite
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
