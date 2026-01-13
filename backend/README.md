# Daily Expense Tracker Backend (M&M Tracker)

FastAPI-based backend for the Daily Expense Tracker with Mocha & Milky characters.

## Setup Instructions

### 1. Python Environment

**Recommended:** Python 3.12 (Python 3.13 has SQLAlchemy compatibility issues)

Create and activate virtual environment:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

## Project Structure

```
backend2/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── database.py          # SQLite database setup
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── security.py          # JWT and password utilities
│   └── routes/
│       ├── auth.py          # Authentication endpoints
│       ├── expenses.py       # Expense endpoints
│       ├── incomes.py        # Income endpoints
│       ├── dashboard.py      # Dashboard endpoints
│       └── settings.py       # Settings endpoints
└── requirements.txt         # Python dependencies
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `GET /auth/verify?token=...` - Verify email with token
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Expenses
- `POST /expenses` - Create expense
- `GET /expenses?month=1&year=2026&category=Food` - List expenses
- `DELETE /expenses/{id}` - Delete expense

### Incomes
- `POST /incomes` - Create income
- `GET /incomes?month=1&year=2026` - List incomes
- `DELETE /incomes/{id}` - Delete income

### Dashboard
- `GET /dashboard/summary?month=1&year=2026` - Get income/expense totals
- `GET /dashboard/recent-activity?limit=3` - Get recent transactions

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings (currency, etc.)

## Database

SQLite database (`test.db`) is created automatically on first run. The database includes:

- **users** - User accounts with email verification
- **expenses** - Expenses with category, amount, date, **currency** (USD/INR)
- **incomes** - Incomes with source, amount, date, **currency** (USD/INR)
- **settings** - User settings (currency preference, exchange rate)
- **saving_plans** - Monthly saving goals

### Smart Currency Storage

Each expense and income stores the currency it was entered in:
- If entered in INR while INR is selected → stored with currency="INR"
- If entered in USD while USD is selected → stored with currency="USD"

This enables smart conversion when switching currencies in Settings.

## Email Verification

In development, verification tokens are printed to console:

```
============================================================
VERIFICATION EMAIL (DEV MODE - Console)
============================================================
User: user@example.com
Verification Link: http://localhost:3000/verify?token=...
Token: ...
Expires: ...
============================================================
```

Copy the link and visit it in your browser to verify the email, or use the token in your API calls.

## Currency Support

### Smart Currency Conversion System

**Supported Currencies:**
- **USD** - US Dollar ($)
- **INR** - Indian Rupee (₹)
- Exchange rate: 1 USD = 81 INR (configurable in settings)

**How it works:**

1. **Storage:** Each transaction stores the currency it was entered in
   - Example: Enter 8000 in INR → Stored as: `{amount: 8000, currency: "INR"}`
   - Example: Enter 100 in USD → Stored as: `{amount: 100, currency: "USD"}`

2. **Display:** When viewing transactions:
   - **No conversion needed** if stored currency matches selected currency
   - **Automatic conversion** if currencies differ:
     - INR → USD: Amount ÷ 81
     - USD → INR: Amount × 81

3. **Example Workflow:**
   - User enters expense: 8000 INR
   - Views in INR: Shows ₹8000 (no conversion)
   - Switches to USD: Shows $98.77 (converted: 8000 ÷ 81)
   - Switches back to INR: Shows ₹8000 (original amount)

This prevents unwanted multiplication when switching currency settings!

## Authentication

All protected endpoints require passing a `token` query parameter with the JWT token from login.

Example:
```
GET /expenses?token=eyJhbGc...
```

## Notes

- **Python Version:** Use Python 3.12 (SQLAlchemy 2.0.36 has issues with Python 3.13)
- **Database Location:** `backend2/test.db`
- **Exchange Rate:** Default 1 USD = 81 INR (change in settings)
- Change `SECRET_KEY` in `app/security.py` for production
- CORS is allowed from all origins (`*`) - restrict in production
- Email verification currently prints to console (add SMTP in production)

## Recent Updates

- ✅ Smart currency conversion system (stores currency with each transaction)
- ✅ Prevents unwanted multiplication when switching currencies
- ✅ Exchange rate updated from 83 to 81 INR per USD
- ✅ Removed EUR and GBP currency options (simplified to USD/INR only)
- ✅ Dynamic currency symbols in all forms and displays
