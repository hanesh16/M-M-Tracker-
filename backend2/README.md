# M&M Tracker Backend

This is a FastAPI-based backend for the M&M Tracker expense management application.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

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

- **users** - User accounts with verification status
- **expenses** - User expenses with category, amount, date
- **incomes** - User incomes with source, amount, date
- **settings** - User settings (currency preference, conversion rates)

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

- **USD** (default for Mocha category)
- **INR** (default for Milky category)
- Conversion rate stored in settings (default 1 USD = 83 INR)

## Authentication

All protected endpoints require passing a `token` query parameter with the JWT token from login.

Example:
```
GET /expenses?token=eyJhbGc...
```

## Notes

- Change `SECRET_KEY` in `app/security.py` for production
- CORS is allowed from all origins (`*`) - restrict in production
- Email verification currently prints to console (add SMTP in production)
