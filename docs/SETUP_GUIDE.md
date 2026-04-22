# 🚀 Complete Setup Guide - Contact Scraper Extension

This guide will walk you through setting up both the Chrome extension and the backend email server.

---

## 📦 Part 1: Backend Server Setup

### Step 1: Install Node.js

If you don't have Node.js installed:
1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS version (recommended)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Backend Dependencies

Open PowerShell/Command Prompt and run:

```bash
cd backend
npm install
```

This will install:
- express (web server)
- nodemailer (email sending)
- multer (file uploads)
- cors (cross-origin requests)
- dotenv (environment variables)

### Step 3: Configure Email Settings

1. **Copy the example environment file:**
   ```bash
   copy .env.example .env
   ```

2. **Get Gmail App Password:**
   - Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Sign in to your Google account
   - If you don't see "App passwords", enable 2-Step Verification first
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Edit the `.env` file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   PORT=3000
   ```

   Replace:
   - `your-email@gmail.com` with your Gmail address
   - `abcdefghijklmnop` with your App Password (remove spaces)

### Step 4: Test Email Configuration

```bash
npm test
```

You should see:
```
✅ SMTP connection verified successfully!
📧 Email account: your-email@gmail.com
📤 Sending test email...
✅ Test email sent successfully!
```

Check your inbox for the test email.

### Step 5: Start the Backend Server

```bash
npm start
```

You should see:
```
✅ Email server running on http://localhost:3000
📧 SMTP configured for: your-email@gmail.com
```

**Keep this terminal window open!** The server must be running for the extension to send emails.

---

## 🔌 Part 2: Chrome Extension Setup

### Step 1: Verify Extension Files

Make sure you have all files in your project folder:
- ✅ manifest.json
- ✅ popup.html
- ✅ popup.js
- ✅ content.js
- ✅ background.js
- ✅ styles.css
- ✅ icon16.png
- ✅ icon48.png
- ✅ icon128.png

### Step 2: Load Extension in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select folder: `extension/` (the root project folder)
5. Extension should appear in the list

### Step 3: Pin the Extension

1. Click the puzzle icon 🧩 in Chrome toolbar
2. Find "Company Contact Scraper"
3. Click the pin icon 📌

---

## 🎯 Part 3: Using the Extension

### Test the Extension

1. **Start the backend server** (if not already running):
   ```bash
   cd backend
   npm start
   ```

2. **Visit a company website** with contact information, for example:
   - https://www.ycombinator.com/companies
   - Any startup's contact page
   - LinkedIn company pages

3. **Click the extension icon** in your toolbar

4. **View scraped contacts:**
   - Emails
   - LinkedIn profiles
   - WhatsApp contacts

5. **Send an email:**
   - Click "Send Collaboration Email"
   - Fill in your details
   - (Optional) Attach a PDF
   - Click "Send Email"

### Expected Behavior

✅ **Success:** "Email sent successfully!" message appears  
❌ **Backend not running:** "Backend server not running" error  
❌ **Invalid email:** "Invalid email format" error  
❌ **Large PDF:** "PDF file must be less than 10MB" error

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: "Invalid login" error**
- Solution: Make sure you're using an App Password, not your regular Gmail password
- Enable 2-Step Verification on your Google account first

**Problem: "Connection timeout"**
- Solution: Check your firewall settings
- Try port 465 with `secure: true` in server.js

**Problem: "EADDRINUSE: Port 3000 already in use"**
- Solution: Change PORT in .env to 3001 or another port
- Update API_URL in popup.js to match

### Extension Issues

**Problem: Extension not loading**
- Solution: Check for errors in `chrome://extensions/`
- Verify all files are present
- Check manifest.json for syntax errors

**Problem: "Backend server not running" error**
- Solution: Make sure backend is running (`npm start`)
- Check that API_URL in popup.js matches your server port

**Problem: No contacts found**
- Solution: Visit pages with visible contact information
- Try Contact Us or About pages
- Some sites hide emails in images (won't be detected)

---

## 📧 Email Providers Configuration

### Gmail (Default)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Keep EMAIL_PASSWORD secure** - don't share it
4. **Limit CORS** in production (currently allows all origins)
5. **Use HTTPS** in production environments

---

## 🚀 Production Deployment (Optional)

To deploy the backend to a server:

1. **Deploy to Heroku/Railway/Render:**
   - Push code to GitHub
   - Connect to deployment platform
   - Set environment variables in platform dashboard
   - Update API_URL in popup.js to your deployed URL

2. **Update Extension:**
   ```javascript
   // In popup.js, change:
   const API_URL = 'https://your-backend.herokuapp.com';
   ```

3. **Reload extension** in Chrome

---

## 📊 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Test email sends successfully
- [ ] Extension loads in Chrome
- [ ] Extension icon appears in toolbar
- [ ] Contacts are scraped from test website
- [ ] Email form opens and displays
- [ ] PDF file can be attached
- [ ] Email sends successfully with backend
- [ ] Success message appears
- [ ] Email arrives in recipient inbox

---

## 🆘 Need Help?

### Check Logs

**Backend logs:**
- Check the terminal where `npm start` is running
- Look for error messages

**Extension logs:**
- Right-click extension icon → "Inspect popup"
- Check Console tab for errors

### Common Commands

```bash
# Start backend
cd backend
npm start

# Test email config
npm test

# Install dependencies
npm install

# Development mode (auto-restart)
npm run dev
```

---

## ✅ Quick Start Summary

1. **Backend:**
   ```bash
   cd backend
   npm install
   copy .env.example .env
   # Edit .env with your email credentials
   npm test
   npm start
   ```

2. **Extension:**
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Load unpacked → Select the project folder
   - Pin extension to toolbar

3. **Test:**
   - Visit a company website
   - Click extension icon
   - Send a test email

---

**🎉 You're all set! The extension is ready to use.**
