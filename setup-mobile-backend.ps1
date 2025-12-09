# Mobile Backend Setup Script
# This script prepares your backend to accept connections from mobile devices

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "HerbalTrace Mobile Backend Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get local IP address
Write-Host "Step 1: Finding your computer's IP address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch 'Loopback'} | Select-Object -First 1).IPAddress
Write-Host "✓ Your IP Address: $ipAddress" -ForegroundColor Green
Write-Host ""

# Step 2: Check if backend is running
Write-Host "Step 2: Checking if backend is running..." -ForegroundColor Yellow
$backendRunning = Get-Process -Name node -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✓ Backend is already running" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend is not running. Start it with: npm start" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Check firewall rule
Write-Host "Step 3: Checking firewall configuration..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "HerbalTrace Backend" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "✓ Firewall rule already exists" -ForegroundColor Green
} else {
    Write-Host "Creating firewall rule..." -ForegroundColor Yellow
    try {
        New-NetFirewallRule -DisplayName "HerbalTrace Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction Stop
        Write-Host "✓ Firewall rule created successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Failed to create firewall rule. Run PowerShell as Administrator" -ForegroundColor Red
    }
}
Write-Host ""

# Step 4: Test API endpoint
Write-Host "Step 4: Testing API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend API is responding" -ForegroundColor Green
    Write-Host "  API Name: $($response.name)" -ForegroundColor Gray
    Write-Host "  Version: $($response.version)" -ForegroundColor Gray
} catch {
    Write-Host "⚠ Backend API is not responding" -ForegroundColor Red
}
Write-Host ""

# Step 5: Display mobile app configuration
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Mobile App Configuration" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Update your Flutter app with these settings:" -ForegroundColor White
Write-Host ""
Write-Host "// lib/config/api_config.dart" -ForegroundColor Gray
Write-Host "class ApiConfig {" -ForegroundColor Gray
Write-Host "  static const String BASE_URL = 'http://$ipAddress`:3000/api/v1';" -ForegroundColor Yellow
Write-Host "}" -ForegroundColor Gray
Write-Host ""

# Step 6: Test connectivity from mobile
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test From Your Mobile Device" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Connect your mobile to the SAME WiFi network" -ForegroundColor White
Write-Host "2. Open a browser on your mobile device" -ForegroundColor White
Write-Host "3. Navigate to: http://$ipAddress`:3000" -ForegroundColor Yellow
Write-Host "4. You should see the HerbalTrace API welcome page" -ForegroundColor White
Write-Host ""

# Step 7: Display test endpoints
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "API Endpoints for Mobile App" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login:" -ForegroundColor White
Write-Host "  POST http://$ipAddress`:3000/api/v1/auth/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "Submit Collection:" -ForegroundColor White
Write-Host "  POST http://$ipAddress`:3000/api/v1/collections" -ForegroundColor Yellow
Write-Host "  (Requires Authorization header with Bearer token)" -ForegroundColor Gray
Write-Host ""
Write-Host "Get Collections:" -ForegroundColor White
Write-Host "  GET http://$ipAddress`:3000/api/v1/collections" -ForegroundColor Yellow
Write-Host "  (Requires Authorization header with Bearer token)" -ForegroundColor Gray
Write-Host ""

# Step 8: Test user credentials
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test User Credentials" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking available users..." -ForegroundColor Yellow

# Read from database
$db = ".\data\herbaltrace.db"
if (Test-Path $db) {
    Write-Host ""
    Write-Host "Sample Farmer Credentials:" -ForegroundColor Green
    Write-Host "  Username: farmer-1765221082597-p4a9" -ForegroundColor Yellow
    Write-Host "  Password: Check with: node show-users.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Run this command to see all users:" -ForegroundColor White
    Write-Host "  node show-users.js" -ForegroundColor Yellow
} else {
    Write-Host "⚠ Database not found. Make sure backend is set up correctly." -ForegroundColor Red
}
Write-Host ""

# Step 9: Alternative - ngrok setup
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Alternative: Use ngrok (External Access)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If mobile is on a different network:" -ForegroundColor White
Write-Host "1. Install ngrok: https://ngrok.com/download" -ForegroundColor White
Write-Host "2. Run: ngrok http 3000" -ForegroundColor Yellow
Write-Host "3. Copy the HTTPS URL from ngrok" -ForegroundColor White
Write-Host "4. Use that URL in your Flutter app" -ForegroundColor White
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Start backend if not running: npm start" -ForegroundColor Gray
Write-Host "2. Update Flutter app with IP: $ipAddress" -ForegroundColor Gray
Write-Host "3. Test connection from mobile browser" -ForegroundColor Gray
Write-Host "4. Test login from Flutter app" -ForegroundColor Gray
Write-Host "5. Submit a test collection" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see: MOBILE_APP_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
