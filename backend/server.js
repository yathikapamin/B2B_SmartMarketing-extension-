const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads (PDF)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
    }
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// Send email endpoint
app.post('/api/send-email', upload.single('pdf'), async (req, res) => {
  try {
    const { senderName, senderEmail, recipientEmail, message, subject } = req.body;

    // Validation
    if (!senderName || !senderEmail || !recipientEmail || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail) || !emailRegex.test(senderEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const transporter = createTransporter();

    // Prepare email options
    const mailOptions = {
      from: `"${senderName}" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: subject || `Collaboration Opportunity from ${senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Collaboration Opportunity</h2>
          <p>Hello,</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666;">
            <strong>Best regards,</strong><br>
            ${senderName}<br>
            <a href="mailto:${senderEmail}" style="color: #667eea;">${senderEmail}</a>
          </p>
          ${req.file ? '<p style="color: #999; font-size: 12px;">📎 Please find the attached document for more details.</p>' : ''}
        </div>
      `,
      text: `Hello,\n\n${message}\n\nBest regards,\n${senderName}\n${senderEmail}`
    };

    // Attach PDF if provided
    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname || 'document.pdf',
        content: req.file.buffer,
        contentType: 'application/pdf'
      }];
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Test email configuration endpoint
app.post('/api/test-config', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({
      success: true,
      message: 'Email configuration is valid'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Email configuration is invalid: ' + error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Email server running on http://localhost:${PORT}`);
  console.log(`📧 SMTP configured for: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`\nEndpoints:`);
  console.log(`  - GET  /health`);
  console.log(`  - POST /api/send-email`);
  console.log(`  - POST /api/test-config`);
});
