# Technical Stack & Methodology

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Content   │  │  Popup     │  │    Background        │  │
│  │  Script    │  │  (UI)      │  │    Service Worker    │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│       │               │                      │               │
│       │ Scrapes       │ User                 │ Manages      │
│       │ Contacts      │ Interaction          │ Extension    │
│       │               │                      │ Lifecycle    │
└───────┼───────────────┼──────────────────────┼───────────────┘
        │               │                      │
        ▼               ▼                      ▼
   Web Page        Local Storage         Chrome APIs
                        │
                        │
                        ▼
              ┌──────────────────┐
              │  Node.js Backend │
              │   (Email Server) │
              └──────────────────┘
                        │
                        ▼
                   SMTP Server
                (Gmail/Outlook)
```

---

## 📚 Technology Stack

### **Frontend (Chrome Extension)**

#### 1. **Core Technologies**
- **HTML5** - Structure and markup
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Logic and functionality

#### 2. **Chrome Extension APIs**
- **Manifest V3** - Latest extension format
- **chrome.tabs** - Tab management
- **chrome.scripting** - Content script injection
- **chrome.storage.local** - Data persistence
- **chrome.runtime** - Extension messaging

#### 3. **Web APIs**
- **Fetch API** - HTTP requests to backend
- **FormData API** - File upload handling
- **Clipboard API** - Copy to clipboard
- **DOM API** - Page manipulation

### **Backend (Email Server)**

#### 1. **Runtime**
- **Node.js v22.17.1** - JavaScript runtime

#### 2. **Framework**
- **Express.js v4.21.1** - Web framework

#### 3. **Email Handling**
- **Nodemailer v6.9.13** - SMTP email sending
- **Gmail SMTP** - Email delivery service

#### 4. **File Upload**
- **Multer v2.0.0** - Multipart form data handling
- **File size limit:** 10MB

#### 5. **Security & Configuration**
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **TLS/STARTTLS** - Email encryption

### **External Services**

#### 1. **Messaging Platforms**
- **WhatsApp Web API** - wa.me links
- **LinkedIn** - Direct profile links

#### 2. **SMTP Providers**
- **Gmail SMTP** - smtp.gmail.com:587
- **Outlook/Yahoo** - Alternative providers
- **Ethereal Email** - Testing environment

---

## 🎯 Methodology

### **1. Web Scraping Approach**

#### **Content Script Injection**
```javascript
// Injected into every webpage
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  function: scrapeContactInfo
});
```

#### **Pattern Matching**
```javascript
// Email extraction
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Phone extraction (India)
const phoneRegex = /(\+91[\s-]?[6-9]\d{9})/g;

// Phone extraction (USA)
const phoneRegex = /(\+1[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4})/g;
```

#### **Link Parsing**
```javascript
// LinkedIn profiles
if (href.includes('linkedin.com/in/') || 
    href.includes('linkedin.com/company/')) {
  data.linkedin.add(link.href);
}

// WhatsApp links
if (href.includes('wa.me/') || 
    href.includes('api.whatsapp.com')) {
  data.whatsapp.add(link.href);
}

// Email links
if (href.startsWith('mailto:')) {
  const email = href.replace('mailto:', '').split('?')[0];
  data.emails.add(email);
}
```

### **2. Data Storage Strategy**

#### **Local Storage (Chrome Storage API)**
```javascript
// Save user preferences
chrome.storage.local.set({
  senderName: "John Doe",
  senderEmail: "john@example.com",
  whatsappMessage: "Template message",
  linkedinMessage: "Template message"
});

// Retrieve on load
chrome.storage.local.get(['senderName', 'senderEmail']);
```

#### **Benefits**
- Persists across sessions
- No server storage needed
- Privacy-friendly
- Fast access

### **3. Email Sending Architecture**

#### **Client-Side (Extension)**
```javascript
// Prepare form data
const formData = new FormData();
formData.append('senderName', name);
formData.append('senderEmail', email);
formData.append('recipientEmail', recipient);
formData.append('message', message);
formData.append('pdf', pdfFile); // Optional

// Send to backend
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  body: formData
});
```

#### **Server-Side (Node.js)**
```javascript
// Receive and process
app.post('/api/send-email', upload.single('pdf'), async (req, res) => {
  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Send email with attachment
  await transporter.sendMail({
    from: senderEmail,
    to: recipientEmail,
    subject: 'Collaboration Opportunity',
    html: emailTemplate,
    attachments: pdfFile ? [{
      filename: pdfFile.originalname,
      path: pdfFile.path
    }] : []
  });
});
```

### **4. WhatsApp Integration**

#### **Click-to-Chat API**
```javascript
// Format: https://wa.me/<phone>
const phoneNumber = '+919876543210';
const whatsappUrl = `https://wa.me/${phoneNumber}`;

// Open in new tab
chrome.tabs.create({ url: whatsappUrl });
```

#### **Phone Number Validation**
```javascript
// Clean phone number
phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

// Validate format
if (!phoneNumber.startsWith('+')) {
  return error('Must start with country code');
}

if (phoneNumber.length < 10) {
  return error('Too short');
}
```

### **5. LinkedIn Integration**

#### **Direct Profile Access**
```javascript
// Simply open profile URL
const profileUrl = 'https://linkedin.com/in/username';
chrome.tabs.create({ url: profileUrl });
```

#### **No API Required**
- LinkedIn doesn't support pre-filled messages
- User types manually in LinkedIn
- More natural interaction

---

## 🔒 Security Measures

### **1. Extension Security**

#### **Manifest V3 Compliance**
```json
{
  "manifest_version": 3,
  "permissions": [
    "activeTab",      // Current tab only
    "scripting",      // Script injection
    "storage"         // Local storage
  ],
  "host_permissions": [
    "<all_urls>"      // Access all websites
  ]
}
```

#### **Content Security Policy**
- No inline scripts
- No eval() usage
- Strict CSP headers

### **2. Backend Security**

#### **Environment Variables**
```bash
# .env file (not committed to git)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
PORT=3000
```

#### **CORS Configuration**
```javascript
app.use(cors({
  origin: 'chrome-extension://*',
  methods: ['POST'],
  credentials: true
}));
```

#### **File Upload Limits**
```javascript
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024  // 10MB max
  }
});
```

### **3. Email Security**

#### **SMTP Authentication**
- TLS/STARTTLS encryption
- App-specific passwords (not regular passwords)
- Secure credential storage

#### **Gmail App Passwords**
```
1. Enable 2-Factor Authentication
2. Generate App Password (16 characters)
3. Use in .env file
4. Never commit to git
```

---

## 📊 Data Flow

### **1. Contact Scraping Flow**

```
User visits website
        ↓
Extension icon clicked
        ↓
Content script injected
        ↓
DOM traversal & regex matching
        ↓
Extract emails, LinkedIn, WhatsApp
        ↓
Store in Sets (deduplicate)
        ↓
Display in popup UI
        ↓
Save to chrome.storage.local
```

### **2. Email Sending Flow**

```
User fills email form
        ↓
Select recipient & write message
        ↓
(Optional) Attach PDF file
        ↓
Click "Send Email"
        ↓
FormData created with file
        ↓
POST to backend API
        ↓
Backend validates data
        ↓
Nodemailer creates transporter
        ↓
Email sent via SMTP
        ↓
Success/error response
        ↓
Display status to user
```

### **3. WhatsApp Messaging Flow**

```
User clicks "WhatsApp"
        ↓
Select contact from dropdown
        ↓
(Optional) Write reference message
        ↓
Click "Open WhatsApp"
        ↓
Extract phone number
        ↓
Validate format (+country code)
        ↓
Create wa.me URL
        ↓
Open in new tab
        ↓
WhatsApp Web/App opens
        ↓
User types & sends manually
```

### **4. LinkedIn Messaging Flow**

```
User clicks "LinkedIn"
        ↓
Select profile from dropdown
        ↓
(Optional) Write reference message
        ↓
Click "Open LinkedIn"
        ↓
Open profile URL in new tab
        ↓
LinkedIn opens
        ↓
User clicks "Message" button
        ↓
User types & sends manually
```

---

## 🎨 Design Patterns

### **1. Module Pattern**
```javascript
// Separate concerns
const scraper = {
  scrapeEmails: () => {},
  scrapeLinkedIn: () => {},
  scrapeWhatsApp: () => {}
};

const ui = {
  displayContacts: () => {},
  showForm: () => {},
  hideForm: () => {}
};
```

### **2. Event-Driven Architecture**
```javascript
// Event listeners for user actions
sendEmailBtn.addEventListener('click', handleEmailSend);
sendWhatsAppBtn.addEventListener('click', handleWhatsAppOpen);
sendLinkedInBtn.addEventListener('click', handleLinkedInOpen);
```

### **3. Async/Await Pattern**
```javascript
// Clean asynchronous code
async function sendEmail() {
  try {
    const response = await fetch(API_URL, options);
    const result = await response.json();
    handleSuccess(result);
  } catch (error) {
    handleError(error);
  }
}
```

### **4. State Management**
```javascript
// Global state
let scrapedData = null;
let selectedPdfFile = null;

// Update state
scrapedData = results[0].result;
selectedPdfFile = file;
```

---

## 🧪 Testing Strategy

### **1. Manual Testing**

#### **Extension Testing**
```
1. Load unpacked extension
2. Visit test websites
3. Verify contact scraping
4. Test all three messaging channels
5. Verify data persistence
```

#### **Backend Testing**
```bash
# Test SMTP configuration
npm test

# Start server
npm start

# Test email endpoint
curl -X POST http://localhost:3000/api/send-email
```

### **2. Test Environments**

#### **Ethereal Email**
```javascript
// Generate test credentials
node setup-ethereal.js

// Use for testing without real emails
EMAIL_USER=test@ethereal.email
EMAIL_PASSWORD=test-password
```

### **3. Browser Console Debugging**
```javascript
// Extensive logging
console.log('Opening WhatsApp with:', phoneNumber);
console.log('Scraped data:', scrapedData);
console.error('Error sending email:', error);
```

---

## 📦 Project Structure

```
extension/
├── manifest.json           # Extension configuration
├── popup.html             # Main UI
├── popup.js               # UI logic
├── styles.css             # Styling
├── content.js             # Web scraping
├── background.js          # Service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── backend/               # Email server
│   ├── server.js          # Express server
│   ├── package.json       # Dependencies
│   ├── .env               # Configuration (not committed)
│   ├── test-email.js      # SMTP testing
│   └── uploads/           # Temporary file storage
└── docs/                  # Documentation
    ├── README.md
    ├── FEATURES.md
    ├── SETUP_GUIDE.md
    └── TECHNICAL_STACK.md
```

---

## 🚀 Deployment

### **Extension Deployment**

#### **Development**
```bash
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select extension folder
5. Extension installed!
```

#### **Production**
```bash
1. Zip extension folder
2. Upload to Chrome Web Store
3. Submit for review
4. Publish to users
```

### **Backend Deployment**

#### **Local Development**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

#### **Production Options**

**Option 1: VPS (DigitalOcean, AWS EC2)**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd backend
npm install
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

**Option 2: Heroku**
```bash
heroku create
git push heroku main
heroku config:set EMAIL_USER=your@email.com
heroku config:set EMAIL_PASSWORD=your-password
```

**Option 3: Docker**
```dockerfile
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Performance Optimizations

### **1. Extension Performance**

#### **Lazy Loading**
```javascript
// Only scrape when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  // Scrape on demand
});
```

#### **Efficient DOM Queries**
```javascript
// Cache DOM elements
const emailsList = document.getElementById('emails-list');
const linkedinList = document.getElementById('linkedin-list');
```

#### **Debouncing**
```javascript
// Prevent rapid clicks
let isProcessing = false;
sendBtn.addEventListener('click', async () => {
  if (isProcessing) return;
  isProcessing = true;
  // Process...
  isProcessing = false;
});
```

### **2. Backend Performance**

#### **File Cleanup**
```javascript
// Clean up uploaded files after sending
if (req.file) {
  fs.unlinkSync(req.file.path);
}
```

#### **Connection Pooling**
```javascript
// Reuse SMTP connection
const transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 5
});
```

---

## 🔧 Development Tools

### **Required**
- Node.js v22+
- Chrome Browser
- Text Editor (VS Code recommended)
- Git

### **Recommended VS Code Extensions**
- ESLint
- Prettier
- Chrome Extension Developer Tools
- REST Client

### **Useful Commands**
```bash
# Backend
npm install          # Install dependencies
npm start           # Start server
npm test            # Test SMTP

# Extension
# No build step - just reload in chrome://extensions/
```

---

## 📝 API Documentation

### **Backend API Endpoint**

#### **POST /api/send-email**

**Request:**
```javascript
Content-Type: multipart/form-data

{
  senderName: string,
  senderEmail: string,
  recipientEmail: string,
  message: string,
  pdf: File (optional, max 10MB)
}
```

**Response:**
```javascript
// Success
{
  success: true,
  messageId: "<unique-id@domain.com>"
}

// Error
{
  success: false,
  error: "Error message"
}
```

---

## 🎯 Key Features Implementation

### **1. Contact Scraping**
- **Technology:** Regex + DOM parsing
- **Deduplication:** JavaScript Sets
- **Performance:** O(n) complexity

### **2. Email Sending**
- **Technology:** Nodemailer + SMTP
- **Security:** TLS encryption
- **File Handling:** Multer multipart

### **3. WhatsApp Integration**
- **Technology:** wa.me URL scheme
- **Validation:** Regex + format checking
- **User Experience:** Direct chat opening

### **4. LinkedIn Integration**
- **Technology:** Direct URL navigation
- **Simplicity:** No API required
- **User Experience:** Native LinkedIn interface

### **5. Data Persistence**
- **Technology:** Chrome Storage API
- **Privacy:** Local storage only
- **Capacity:** 5MB limit

---

## 🌟 Best Practices Followed

1. **Manifest V3** - Latest Chrome extension standard
2. **Async/Await** - Modern JavaScript patterns
3. **Error Handling** - Try-catch blocks everywhere
4. **Security** - Environment variables, no hardcoded secrets
5. **User Feedback** - Status messages for all actions
6. **Clean Code** - Modular, commented, readable
7. **Professional UI** - No emojis, clean design
8. **Documentation** - Comprehensive guides

---

**This extension demonstrates modern web development practices with a focus on security, performance, and user experience.**
