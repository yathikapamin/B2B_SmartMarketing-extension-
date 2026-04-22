# PowerShell script to fix Gmail .env configuration

Write-Host "🔧 Gmail .env Configuration Helper" -ForegroundColor Cyan
Write-Host ""

# Get current email
$currentEmail = "martin.luther@gmail.com"
Write-Host "Email: $currentEmail" -ForegroundColor Green

# Prompt for App Password
Write-Host ""
Write-Host "Enter your Gmail App Password (16 characters, can include spaces):" -ForegroundColor Yellow
$appPassword = Read-Host

# Remove all spaces and special characters
$cleanPassword = $appPassword -replace '\s', ''

Write-Host ""
Write-Host "Cleaned password length: $($cleanPassword.Length) characters" -ForegroundColor Cyan

if ($cleanPassword.Length -ne 16) {
    Write-Host "⚠️ WARNING: App Password should be exactly 16 characters!" -ForegroundColor Red
    Write-Host "You entered: $($cleanPassword.Length) characters" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please generate a NEW App Password at:" -ForegroundColor Yellow
    Write-Host "https://myaccount.google.com/apppasswords" -ForegroundColor Yellow
    exit 1
}

# Create .env content
$envContent = @"
EMAIL_USER=$currentEmail
EMAIL_PASSWORD=$cleanPassword
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
PORT=3000
"@

# Write to .env
Set-Content -Path ".env" -Value $envContent

Write-Host ""
Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Email: $currentEmail"
Write-Host "  Password: $cleanPassword"
Write-Host "  SMTP: smtp.gmail.com:587"
Write-Host ""
Write-Host "Now run: npm test" -ForegroundColor Yellow
