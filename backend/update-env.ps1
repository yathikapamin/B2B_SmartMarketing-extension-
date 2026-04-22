# PowerShell script to update .env file with Ethereal credentials
$envContent = @"
EMAIL_USER=hvzubnqggawnvvqq@ethereal.email
EMAIL_PASSWORD=h2gV79uzkckSVvsAGZ
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
PORT=3000
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "✅ .env file updated with Ethereal test credentials!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm test" -ForegroundColor Yellow
