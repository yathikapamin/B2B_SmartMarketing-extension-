# 📧 Contact Scraper Backend Server

Node.js backend server for sending emails with PDF attachments via SMTP.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Email Settings

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your email credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### 3. Get Gmail App Password (Recommended)

**For Gmail users:**

1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in to your Google account
3. Select "Mail" and "Windows Computer" (or Other)
4. Click "Generate"
5. Copy the 16-character password
6. Paste it in `.env` as `EMAIL_PASSWORD`

**Important:** Use App Password, NOT your regular Gmail password!

### 4. Test Configuration

```bash
npm test
```

This will verify your SMTP settings and send a test email to yourself.

### 5. Start Server

```bash
npm start
```

Server will run on `http://localhost:3000`

For development with auto-restart:
```bash
npm run dev
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Send Email
```
POST /api/send-email
Content-Type: multipart/form-data

Body:
- senderName: string (required)
- senderEmail: string (required)
- recipientEmail: string (required)
- message: string (required)
- subject: string (optional)
- pdf: file (optional, max 10MB)
```

### Test Configuration
```
POST /api/test-config
```

## 🔧 Configuration Options

### Using Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

**Custom SMTP:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

## 🛡️ Security Notes

- Never commit `.env` file to version control
- Use App Passwords instead of regular passwords
- Keep your `EMAIL_PASSWORD` secure
- The server uses CORS to allow requests from Chrome extension

## 🐛 Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password for Gmail
- Enable 2-factor authentication on Gmail first
- Check that EMAIL_USER and EMAIL_PASSWORD are correct

### "Connection timeout"
- Check your firewall settings
- Verify SMTP_HOST and SMTP_PORT are correct
- Try port 465 with `secure: true` for some providers

### "File too large"
- PDF files are limited to 10MB
- Compress your PDF if it's too large

## 📝 Example Usage

```javascript
// From Chrome extension
const formData = new FormData();
formData.append('senderName', 'John Doe');
formData.append('senderEmail', 'john@example.com');
formData.append('recipientEmail', 'company@example.com');
formData.append('message', 'I would like to discuss...');
formData.append('pdf', pdfFile); // File object

const response = await fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

## 🔄 Development

The server uses:
- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **Multer** - File upload handling
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 📄 License

MIT
