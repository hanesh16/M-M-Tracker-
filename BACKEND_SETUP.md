# M&M Tracker - Full Backend + Frontend Integration

This document provides complete setup and integration instructions for the M&M Tracker application with FastAPI backend and React frontend.

## Project Structure

```
daily expense tracker/
├── backend2/              # NEW: FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── expenses.py
│   │       ├── incomes.py
│   │       ├── dashboard.py
│   │       └── settings.py
│   ├── requirements.txt
│   ├── README.md
│   └── test.db            (auto-created)
├── frontEnd/              # React frontend (updated)
│   ├── src/
│   │   ├── App.js         (updated for JWT auth)
│   │   ├── pages/
│   │   │   ├── SignupPage.js      (API calls)
│   │   │   ├── LoginPage.js       (API calls)
│   │   │   ├── VerifyEmail.js     (NEW)
│   │   │   ├── DashboardPage.js   (API calls)
│   │   │   ├── AddExpense.js      (ready for API)
│   │   │   ├── AddIncome.js       (ready for API)
│   │   │   └── ... other pages
│   │   └── components/
│   │       └── NavHeader.js       (JWT-based logout)
│   └── package.json
└── backend/               (old backend - can be ignored)
```

## Quick Start

### 1. Backend Setup

```bash
cd backend2
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will run on `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Frontend Setup

```bash
cd frontEnd
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## Key Updates Made

### Backend (NEW)

- **FastAPI + SQLAlchemy** with SQLite database
- **User Authentication**:
  - JWT token-based auth
  - Email verification with tokens (printed to console in dev)
  - Password hashing with bcrypt
  
- **Data Models**:
  - Users (with profile picture, category Mocha/Milky)
  - Expenses (with category, amount, date, type)
  - Incomes (with source, amount, date)
  - Settings (currency preference, conversion rate)

- **API Endpoints**:
  - `/auth/signup`, `/auth/verify`, `/auth/login`, `/auth/me`
  - `/expenses/` (POST, GET, DELETE)
  - `/incomes/` (POST, GET, DELETE)
  - `/dashboard/summary`, `/dashboard/recent-activity`
  - `/settings/` (GET, PUT)

### Frontend Updates

#### Signup Page
- Replaced localStorage with API calls to `/auth/signup`
- Redirects to `/verify-email` page after signup
- Shows verification status in console

#### Login Page
- Replaced localStorage check with API call to `/auth/login`
- Stores JWT token in `localStorage.getItem('det-token')`
- Added loading state with button disabled

#### New VerifyEmail Page
- Handles email verification via token from URL
- Allows manual token input (copies from console)
- Redirects to login after verification

#### Dashboard Page
- Fetches user data from `/auth/me`
- Fetches recent activities from `/dashboard/recent-activity`
- Creates expenses via POST `/expenses`
- Creates incomes via POST `/incomes`
- Automatically refreshes data

#### Authentication
- Changed from `localStorage.getItem('det-auth') === 'true'` to `localStorage.getItem('det-token') !== null`
- Updated App.js to check for token presence
- NavHeader logout now removes only token

## Authentication Flow

### Signup
1. User fills signup form
2. Frontend POST to `/auth/signup`
3. Backend creates user, generates verification token
4. Token printed to console (dev mode)
5. User redirected to `/verify-email`

### Email Verification
1. User gets token from console
2. Enters token on `/verify-email` page OR visits `/?verify?token=...`
3. Frontend GET `/auth/verify?token=...`
4. Backend marks user as verified

### Login
1. User enters email/password
2. Frontend POST to `/auth/login`
3. Backend verifies credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include `?token=...` in URL

## API Request Format

### With Token (Protected Endpoints)
```
GET /expenses/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

All endpoints that start with `/expenses`, `/incomes`, `/dashboard`, `/settings` require the `token` query parameter.

### Example Request (JavaScript)
```javascript
const token = localStorage.getItem('det-token');
const response = await fetch(`http://localhost:8000/expenses/?token=${token}`, {
  method: 'GET'
});
```

## Database

SQLite database (`backend2/test.db`) is created automatically on first run.

### Tables
- **users** - User accounts
- **expenses** - User expenses
- **incomes** - User incomes  
- **settings** - User settings (currency, conversion rate)

All tables include timestamps (`created_at`) for auditing.

## Email Verification (Development)

In development mode, verification tokens are printed to the console where the backend is running:

```
============================================================
VERIFICATION EMAIL (DEV MODE - Console)
============================================================
User: user@example.com
Verification Link: http://localhost:3000/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Expires: 2026-01-07 12:00:00.123456
============================================================
```

Copy this token and use it to verify email on the `/verify-email` page.

## Currency Support

- **Mocha** (category) → defaults to **USD**
- **Milky** (category) → defaults to **INR**
- Conversion rate stored in settings table (default: 1 USD = 83 INR)

When user changes currency in Settings, it's saved to the database and used in all subsequent requests.

## Protected vs Public Endpoints

### Public (No Token Needed)
- GET `/` (root)
- GET `/health`
- POST `/auth/signup`
- GET `/auth/verify`
- POST `/auth/login`

### Protected (Requires Token)
- GET `/auth/me`
- POST `/expenses`, GET `/expenses`, DELETE `/expenses/{id}`
- POST `/incomes`, GET `/incomes`, DELETE `/incomes/{id}`
- GET `/dashboard/summary`, GET `/dashboard/recent-activity`
- GET `/settings`, PUT `/settings`

## File Changes Summary

### New Files
- `backend2/` - Complete FastAPI backend
- `frontEnd/src/pages/VerifyEmail.js` - Email verification page

### Modified Files
- `frontEnd/src/App.js` - Added VerifyEmail route, JWT auth check
- `frontEnd/src/pages/SignupPage.js` - API integration
- `frontEnd/src/pages/LoginPage.js` - API integration
- `frontEnd/src/pages/DashboardPage.js` - API integration for dashboard, expenses, incomes
- `frontEnd/src/components/NavHeader.js` - Updated logout (token-based)
- `frontEnd/src/pages/Settings.js` - Settings auto-load from API
- `frontEnd/src/pages/Profile.js` - No changes needed (can update later)

### Unchanged
- All UI/styling remains identical
- AddExpense.js, AddIncome.js - Ready for API integration (optional)
- All component designs and layouts

## Next Steps (Optional Enhancements)

1. **AddExpense.js & AddIncome.js** - Update these pages to use backend APIs instead of localStorage
2. **Profile Picture Upload** - Create `/users/{id}/profile-picture` endpoint for image upload
3. **Password Reset** - Add `/auth/forgot-password` and reset flow
4. **Email Notifications** - Integrate real SMTP (Gmail, SendGrid, etc.)
5. **Production Deployment** - Use PostgreSQL, secure JWT secret, proper CORS, environment variables
6. **Error Handling** - Add try-catch and user feedback for all API errors

## Troubleshooting

### "Connection refused" Error
- Make sure backend is running: `uvicorn app.main:app --reload`
- Check backend is on `http://localhost:8000`

### "Token is invalid" Error
- Re-login and get a fresh token
- Tokens expire after 24 hours
- Clear localStorage and try again

### "Email not verified" Error
- Check console output from backend for verification link
- Use the token to verify email on `/verify-email` page
- Try `/verify-email?token=...` directly in browser

### 404 on API Endpoints
- Check frontend is requesting correct URL format: `/expenses/?token=...`
- Make sure token is present in query string
- Verify backend is running and accessible

## Security Notes

⚠️ For production deployment:
1. Change `SECRET_KEY` in `app/security.py`
2. Restrict CORS to specific domains
3. Use environment variables for config
4. Use real database (PostgreSQL)
5. Add HTTPS/SSL
6. Implement rate limiting
7. Add input validation
8. Use secure email service (SendGrid, AWS SES)
9. Add refresh tokens
10. Implement proper error handling

## Support

For issues or questions:
1. Check API docs at `http://localhost:8000/docs`
2. Check backend console for error messages
3. Check browser dev tools Network tab
4. Review backend logs

---

**Last Updated**: January 6, 2026
**Version**: 1.0.0
