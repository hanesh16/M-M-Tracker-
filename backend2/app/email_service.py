import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
FROM_EMAIL = os.getenv('FROM_EMAIL')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

def send_verification_email(user_email: str, verification_token: str) -> bool:
    """
    Send email verification link to user.
    Returns True if successful, False otherwise.
    """
    try:
        # If SMTP credentials not configured, fall back to console printing
        if not SMTP_USER or not SMTP_PASS:
            print_verification_link(user_email, verification_token)
            return True
        
        verification_link = f"{FRONTEND_URL}/verify?token={verification_token}"
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Verify your M&M Tracker Account'
        msg['From'] = FROM_EMAIL
        msg['To'] = user_email
        
        # Plain text version
        text = f"""
Hello,

Welcome to M&M Tracker! Please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours.

If you did not create this account, please ignore this email.

Best regards,
M&M Tracker Team
"""
        
        # HTML version
        html = f"""
<html>
  <body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your M&M Tracker Account</h2>
      <p>Hello,</p>
      <p>Welcome to M&M Tracker! Please verify your email address by clicking the button below:</p>
      <p>
        <a href="{verification_link}" style="display: inline-block; padding: 12px 24px; background-color: #DAA06D; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this link:</p>
      <p><code>{verification_link}</code></p>
      <p><small>This link will expire in 24 hours.</small></p>
      <p>If you did not create this account, please ignore this email.</p>
      <hr>
      <p><small>M&M Tracker Team</small></p>
    </div>
  </body>
</html>
"""
        
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()  # TLS encryption
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        
        print(f"Verification email sent successfully to {user_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        # Fall back to console print
        print_verification_link(user_email, verification_token)
        return False

def print_verification_link(user_email: str, verification_token: str):
    """Fallback: print verification link to console (for development/testing)"""
    verification_link = f"{FRONTEND_URL}/verify?token={verification_token}"
    print(f"\n{'='*60}")
    print(f"VERIFICATION EMAIL (DEV MODE - Console)")
    print(f"{'='*60}")
    print(f"User: {user_email}")
    print(f"Verification Link: {verification_link}")
    print(f"Token: {verification_token}")
    print(f"{'='*60}\n")
