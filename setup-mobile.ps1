# Mobile Backend Setup Script
# This script prepares your backend to accept connections from mobile devices

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "HerbalTrace Mobile Backend Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get local IP address
Write-Host "Step 1: Finding your computer's IP address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch 'Loopback'} | Select-Object -First 1).IPAddress
Write-Host "Success - Your IP Address: $ipAddress" -ForegroundColor Green
Write-Host ""

# Step 2: Check firewall rule
Write-Host "Step 2: Checking firewall configuration..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "HerbalTrace Backend" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "Success - Firewall rule already exists" -ForegroundColor Green
} else {
    Write-Host "Creating firewall rule (requires Administrator)..." -ForegroundColor Yellow
    try {
        New-NetFirewallRule -DisplayName "HerbalTrace Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction Stop | Out-Null
        Write-Host "Success - Firewall rule created" -ForegroundColor Green
    } catch {
        Write-Host "Warning - Failed to create firewall rule. Run PowerShell as Administrator" -ForegroundColor Yellow
    }
}
Write-Host ""

# Step 3: Test API endpoint
Write-Host "Step 3: Testing API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Success - Backend API is responding" -ForegroundColor Green
    Write-Host "  API Name: $($response.name)" -ForegroundColor Gray
} catch {
    Write-Host "Warning - Backend API is not responding. Start it with: npm start" -ForegroundColor Yellow
}
Write-Host ""

# Display mobile app configuration
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Mobile App Configuration" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Update your Flutter app with this IP address:" -ForegroundColor White
Write-Host ""
$baseUrl = "http://${ipAddress}:3000/api/v1"
Write-Host "  BASE_URL = '$baseUrl'" -ForegroundColor Yellow
Write-Host ""

# Display instructions
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test From Your Mobile Device" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Connect mobile to the SAME WiFi network" -ForegroundColor White
Write-Host "2. Open browser on mobile" -ForegroundColor White
$testUrl = "http://${ipAddress}:3000"
Write-Host "3. Navigate to: $testUrl" -ForegroundColor Yellow
Write-Host "4. You should see the API welcome page" -ForegroundColor White
Write-Host ""

# Display API endpoints
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "API Endpoints" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
$loginUrl = "http://${ipAddress}:3000/api/v1/auth/login"
$collectionUrl = "http://${ipAddress}:3000/api/v1/collections"
Write-Host "Login:              POST $loginUrl" -ForegroundColor Yellow
Write-Host "Submit Collection:  POST $collectionUrl" -ForegroundColor Yellow
Write-Host "Get Collections:    GET  $collectionUrl" -ForegroundColor Yellow
Write-Host ""

Write-Host "====================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Start backend: npm start" -ForegroundColor Gray
Write-Host "2. Update Flutter app with IP: $ipAddress" -ForegroundColor Gray
Write-Host "3. Test from mobile browser: $testUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Full guide: MOBILE_APP_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
