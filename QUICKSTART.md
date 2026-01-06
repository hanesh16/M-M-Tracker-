# Quick Start: Run M&M Tracker with All New Features

## Prerequisites
- Python 3.12 venv activated in backend2
- Node.js v22+ installed

## One-Time Setup

### 1. Install Backend Dependencies
```powershell
cd "c:\Users\kapil\Downloads\VibeCoding\daily expense tracker\backend2"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. (Optional) Configure Email Verification
If you want **real emails** sent to your Gmail inbox:

1. Follow the guide: [backend2/GMAIL_SETUP.md](backend2/GMAIL_SETUP.md)
2. Update `backend2/.env` with your Gmail details
3. No .env needed for development (console fallback will be used)

---

## Run the Application (Every Time)

### Terminal 1: Backend Server
```powershell
cd "c:\Users\kapil\Downloads\VibeCoding\daily expense tracker\backend2"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```
✅ Backend runs on: http://127.0.0.1:8000

### Terminal 2: Frontend Server
```powershell
cd "c:\Users\kapil\Downloads\VibeCoding\daily expense tracker\frontEnd"
npm start
```
✅ Frontend opens at: http://localhost:3000

---

## Test the New Features

### Feature 1: Default Avatars
1. Sign up with **Milky** category → pic3 avatar assigned
2. Sign up with **Mocha** category → pic4 avatar assigned
3. Go to Profile → default avatar displays
4. Upload custom photo → custom photo shows instead
5. Delete custom photo → default avatar reappears

### Feature 2: Clear All Data
1. Add expenses, incomes, saving plans
2. Go to Settings
3. Click "Clear All Data"
4. Confirm in dialog
5. All data deleted from database ✅
6. Dashboard refreshes empty ✅

### Feature 3: Merged Recent Activity
1. Add multiple expenses and incomes
2. Go to Dashboard
3. Recent Activity shows both:
   - Expenses with "-" sign (red/brown)
   - Incomes with "+" sign (green)
4. Sorted by date (newest first)

### Feature 4: Email Verification
1. Sign up with your real email (if SMTP configured)
2. **If email configured**: Check Gmail inbox for verification email
3. **If no email configured**: Copy token from backend console
4. Click email link or go to `/verify?token=...`
5. Verify successful → can now login ✅

---

## Troubleshooting

### Backend won't start
```
Error: Failed to initialize database
```
**Solution**: Delete `backend2/expense_tracker.db` and restart

### Email not sending
- Check `.env` file exists in `backend2/`
- Check backend console for printed link (fallback)
- Email errors will show in server logs
- See GMAIL_SETUP.md for detailed troubleshooting

### Frontend shows 404 for endpoints
- Verify backend is running on http://127.0.0.1:8000
- Check browser console (F12) for API errors
- Network tab will show failed requests

### Database locked error
- Stop both terminal sessions (Ctrl+C)
- Wait 2 seconds
- Restart backend, then frontend

---

## API Endpoints Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | Create account with category |
| `/auth/verify` | GET | Verify email with token |
| `/auth/login` | POST | Login with email/password |
| `/auth/me` | GET | Get current user profile |
| `/auth/me` | PUT | Update name/profile_picture |
| `/auth/data` | DELETE | Clear all user data |
| `/dashboard/recent-activity` | GET | Get merged expenses & incomes |
| `/expenses` | GET/POST/DELETE | Manage expenses |
| `/incomes` | GET/POST/DELETE | Manage incomes |
| `/plans` | GET/POST/DELETE | Manage saving plans |
| `/settings` | GET/PUT | Get/update user settings |

All endpoints require `?token=...` query parameter (JWT from login)

---

## Database Location
- File: `backend2/expense_tracker.db` (SQLite)
- Auto-created on first run
- Delete to reset database

---

## Environment Variables (.env)
Located in `backend2/.env`:
- `SMTP_HOST` - Gmail SMTP server (default: smtp.gmail.com)
- `SMTP_PORT` - TLS port (default: 587)
- `SMTP_USER` - Your Gmail email
- `SMTP_PASS` - Your 16-char Gmail app password
- `FROM_EMAIL` - Sender email (usually same as SMTP_USER)
- `FRONTEND_URL` - Your frontend base URL (default: http://localhost:3000)

**⚠️ Never commit .env to Git**

---

## Files Modified

### Backend
- `models.py` - Added default_avatar
- `schemas.py` - Updated UserResponse, RecentActivity
- `routes/auth.py` - Added /data endpoint, email sending
- `routes/dashboard.py` - Merged expenses & incomes
- `requirements.txt` - Added python-dotenv
- `.env` - Configuration (not in git)
- `email_service.py` - NEW email module

### Frontend
- `Profile.js` - Display default avatars
- `Settings.js` - Call /auth/data endpoint
- `DashboardPage.js` - Use title field
- `VerifyEmail.js` - Add .trim() to token

### Documentation
- `GMAIL_SETUP.md` - Email configuration guide
- `IMPLEMENTATION_SUMMARY.md` - Detailed feature summary

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review GMAIL_SETUP.md for email issues
3. Check backend console for error messages
4. Check browser F12 console for frontend errors

