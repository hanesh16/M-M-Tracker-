# Gmail SMTP Setup Guide for Email Verification

## Overview
The M&M Tracker app can send verification emails using Gmail SMTP. This guide walks you through setting up an **App Password** (free) to enable this feature.

---

## Step 1: Enable 2-Factor Authentication (Required for App Passwords)

1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Sign in to your Google account if prompted
3. Look for **"2-Step Verification"** in the left menu
4. Click on it and follow the prompts to set up 2-Factor Authentication
   - Google will ask you to verify your identity (via phone, email, etc.)
   - You can use any 2FA method (authenticator app, SMS, etc.)

---

## Step 2: Generate an App Password

1. After 2FA is enabled, go back to [Google Account Security Settings](https://myaccount.google.com/security)
2. Scroll down to find **"App passwords"** (it will only appear after 2FA is enabled)
3. Click on **"App passwords"**
4. Select:
   - **App**: Mail
   - **Device**: Windows PC (or your device type)
5. Click **"Generate"**
6. Google will display a **16-character app password** (example: `abcd efgh ijkl mnop`)
   - Copy this password (without spaces)

---

## Step 3: Configure the Backend

1. Open `backend2/.env` in your code editor
2. Update these settings with your Gmail account:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

Replace:
- `your-email@gmail.com` with your actual Gmail email address
- `your-app-password` with the 16-character app password from Step 2 (remove spaces)

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kapil@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=kapil@gmail.com
FRONTEND_URL=http://localhost:3000
```

---

## Step 4: Install Dependencies

Run this command in the `backend2` folder:

```powershell
pip install -r requirements.txt
```

This will install `python-dotenv` (which reads the `.env` file).

---

## Step 5: Restart Backend Server

Stop your uvicorn server (if running) and restart it:

```powershell
cd "c:\Users\kapil\Downloads\VibeCoding\daily expense tracker\backend2"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

---

## Step 6: Test Email Sending

1. Sign up with a new account at `http://localhost:3000/signup`
2. Check your **Gmail inbox** for the verification email
3. The email will have:
   - Subject: "Verify your M&M Tracker Account"
   - A **"Verify Email"** button with a link
   - The sender will be your configured FROM_EMAIL

---

## Troubleshooting

### Email not sending?
- **Check `.env` file exists** in `backend2/` folder
- **Verify credentials**: Make sure SMTP_USER and SMTP_PASS are correct
- **Check Gmail security**: Less secure apps might be blocked. Ensure you're using an **App Password**, not your regular Gmail password
- **Check server logs**: Look at the uvicorn terminal for any error messages

### "Failed to send, falling back to console"
- This means email sending failed, but the app will print the verification link to the terminal console
- Use the printed link to manually verify your account
- Check `.env` configuration and Gmail account settings

### App password not generating?
- Make sure **2-Factor Authentication is enabled** first
- If you don't see "App passwords" option in Gmail security, 2FA might not be properly activated
- Wait 10-15 minutes after enabling 2FA, then try again

---

## Environment Variable Reference

| Variable | Example | Description |
|----------|---------|-------------|
| SMTP_HOST | smtp.gmail.com | Gmail SMTP server |
| SMTP_PORT | 587 | TLS port (do not change) |
| SMTP_USER | your-email@gmail.com | Your Gmail address |
| SMTP_PASS | abcdefghijklmnop | 16-char app password (no spaces) |
| FROM_EMAIL | your-email@gmail.com | Sender email (same as SMTP_USER) |
| FRONTEND_URL | http://localhost:3000 | Your frontend base URL |

---

## Security Notes

✅ **Safe**: Using App Passwords (specific to your app, not your main password)
✅ **Safe**: App Password expires/can be revoked independently
✅ **Safe**: Never commit `.env` file to Git (it's already in `.gitignore`)

❌ **Never**: Use your actual Gmail password in `.env`
❌ **Never**: Share your `.env` file publicly
❌ **Never**: Commit `.env` to version control

---

## Fallback Behavior

If email sending fails (e.g., no SMTP credentials configured):
- The app will **print the verification link to the backend console**
- You can copy the printed link and manually paste it in your browser
- This is useful for development/testing without real email

