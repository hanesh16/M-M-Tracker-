from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routes import auth, expenses, incomes, dashboard, settings
from app.routes import plans

# Initialize database on startup
def startup():
    init_db()
    print("Database initialized successfully!")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    startup()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="M&M Tracker API", 
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(incomes.router)
app.include_router(dashboard.router)
app.include_router(settings.router)
app.include_router(plans.router)

@app.get("/")
def read_root():
    return {
        "message": "M&M Tracker API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
