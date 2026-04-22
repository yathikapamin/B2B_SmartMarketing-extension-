// Check .env configuration
require('dotenv').config();

console.log('🔍 Checking .env configuration...\n');

console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length + ' characters' : '❌ NOT SET');
console.log('EMAIL_PASSWORD has spaces:', process.env.EMAIL_PASSWORD ? (process.env.EMAIL_PASSWORD.includes(' ') ? '⚠️ YES (REMOVE THEM!)' : '✅ NO') : 'N/A');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');

console.log('\n📋 Common Issues:');
console.log('1. App Password should be 16 characters (no spaces)');
console.log('2. Make sure 2-Step Verification is enabled on Gmail');
console.log('3. Generate a NEW App Password if the old one doesn\'t work');
console.log('4. Wait 5-10 minutes after generating App Password');

if (process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.includes(' ')) {
  console.log('\n⚠️ WARNING: Your password contains spaces! Remove them!');
  console.log('Example: "abcd efgh ijkl mnop" should be "abcdefghijklmnop"');
}
