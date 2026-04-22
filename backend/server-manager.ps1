# Server Manager Script
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'status')]
    [string]$Action = 'status'
)

$PORT = 3000

function Get-ServerStatus {
    $process = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
    if ($process) {
        $pid = $process.OwningProcess
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "✅ Server is RUNNING" -ForegroundColor Green
            Write-Host "   PID: $pid" -ForegroundColor Cyan
            Write-Host "   Port: $PORT" -ForegroundColor Cyan
            Write-Host "   URL: http://localhost:$PORT" -ForegroundColor Cyan
            return $true
        }
    }
    Write-Host "❌ Server is NOT running" -ForegroundColor Red
    return $false
}

function Stop-Server {
    $process = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
    if ($process) {
        $pid = $process.OwningProcess
        Write-Host "🛑 Stopping server (PID: $pid)..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force
        Start-Sleep -Seconds 1
        Write-Host "✅ Server stopped" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Server is not running" -ForegroundColor Cyan
    }
}

function Start-Server {
    if (Get-ServerStatus) {
        Write-Host "⚠️ Server is already running!" -ForegroundColor Yellow
        Write-Host "   Use 'restart' to restart the server" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🚀 Starting server..." -ForegroundColor Green
    Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
    Start-Sleep -Seconds 2
    Get-ServerStatus
}

function Restart-Server {
    Write-Host "🔄 Restarting server..." -ForegroundColor Cyan
    Stop-Server
    Start-Sleep -Seconds 1
    Start-Server
}

# Main execution
switch ($Action) {
    'start' { Start-Server }
    'stop' { Stop-Server }
    'restart' { Restart-Server }
    'status' { Get-ServerStatus }
}

Write-Host ""
Write-Host "Usage: .\server-manager.ps1 [start|stop|restart|status]" -ForegroundColor Gray
