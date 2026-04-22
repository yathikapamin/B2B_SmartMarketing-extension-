// Test script to verify email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🧪 Testing email configuration...\n');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Error: EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    console.log(`📧 Email account: ${process.env.EMAIL_USER}`);
    console.log(`🔧 SMTP server: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}\n`);

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Contact Scraper Extension',
      html: `
        <h2>✅ Email Configuration Test Successful!</h2>
        <p>Your email server is configured correctly and ready to send emails.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}\n`);
    console.log('🎉 Your backend is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   - Make sure you\'re using an App Password (not your regular password)');
    console.error('   - Enable "Less secure app access" or use App Passwords for Gmail');
    console.error('   - Check your SMTP settings in .env file');
    process.exit(1);
  }
}

testEmailConfig();
