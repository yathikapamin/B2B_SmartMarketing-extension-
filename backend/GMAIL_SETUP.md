# 📧 Gmail App Password Setup Guide

## ⚠️ Current Issue

You're seeing this error:
```
❌ Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means Gmail is rejecting your credentials because you're using your **regular password** instead of an **App Password**.

---

## ✅ Solution: Generate Gmail App Password

### Step 1: Enable 2-Step Verification

1. Go to: **https://myaccount.google.com/security**
2. Scroll down to "How you sign in to Google"
3. Click on **"2-Step Verification"**
4. Click **"Get Started"**
5. Follow the prompts to set up 2-Step Verification (usually requires your phone)

### Step 2: Generate App Password

1. Go to: **https://myaccount.google.com/apppasswords**
2. You may need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Windows Computer"** (or "Other")
5. Click **"Generate"**
6. Gmail will show a **16-character password** like: `abcd efgh ijkl mnop`
7. **Copy this password** (you won't see it again!)

### Step 3: Update Your .env File

Open `d:/project/extension/backend/.env` and update:

```env
EMAIL_USER=martin.luther@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**IMPORTANT:** 
- Remove ALL spaces from the App Password
- Use the 16-character code, not your regular password
- Example: `abcdefghijklmnop` (NOT `abcd efgh ijkl mnop`)

### Step 4: Test Again

```bash
npm test
```

You should see:
```
✅ SMTP connection verified successfully!
✅ Test email sent successfully!
```

---

## 🔄 Alternative: Use Outlook/Yahoo Instead

If Gmail is too complicated, you can use other email providers:

### Outlook/Hotmail (Easier - No App Password Needed)

Edit `.env`:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-regular-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo Mail (Requires App Password)

1. Go to: https://login.yahoo.com/account/security
2. Generate App Password
3. Edit `.env`:
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

---

## 🐛 Troubleshooting

### "2-Step Verification not available"
- Make sure you're signed into the correct Google account
- Some G Suite/Workspace accounts may have restrictions

### "Can't find App Passwords option"
- You MUST enable 2-Step Verification first
- Wait a few minutes after enabling 2-Step Verification

### "Still getting authentication error"
- Double-check there are NO spaces in the App Password
- Make sure EMAIL_USER is your full email address
- Try generating a new App Password

### "Don't want to use 2-Step Verification"
- Use Outlook instead (no 2-Step required)
- Or use a different Gmail account

---

## 📝 Quick Checklist

- [ ] 2-Step Verification is enabled on Gmail
- [ ] App Password is generated (16 characters)
- [ ] App Password copied to `.env` file WITHOUT spaces
- [ ] EMAIL_USER is `martin.luther@gmail.com`
- [ ] `.env` file is saved
- [ ] Ran `npm test` successfully

---

## 🎯 After Setup

Once `npm test` works, start the server:

```bash
npm start
```

Then reload your Chrome extension and test sending an email!

---

**Need help?** Let me know which step you're stuck on!
