// Auto-setup Ethereal test account
const nodemailer = require('nodemailer');

async function setupEthereal() {
  console.log('🔧 Creating Ethereal test account...\n');
  
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Ethereal test account created!\n');
    console.log('📧 Email:', testAccount.user);
    console.log('🔑 Password:', testAccount.pass);
    console.log('🌐 SMTP Host:', testAccount.smtp.host);
    console.log('🔌 SMTP Port:', testAccount.smtp.port);
    console.log('\n📋 Copy these to your .env file:\n');
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log('\n💡 Emails will be captured at: https://ethereal.email/messages');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupEthereal();
