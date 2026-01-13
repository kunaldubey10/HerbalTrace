# Create Initial Admin User
# Run this script to create the first admin user who can approve other users

Write-Host "Creating initial admin user..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://herb-production-92c3.up.railway.app/api/v1"

# First, submit a registration request for admin
$adminRequest = @{
    fullName = "System Administrator"
    phone = "+919999999999"
    email = "admin@herbaltrace.com"
    role = "Admin"
    organizationName = "HerbalTrace Admin"
} | ConvertTo-Json

Write-Host "Step 1: Submitting admin registration request..." -NoNewline
try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/registration-request" -Method POST -Body $adminRequest -ContentType "application/json" -ErrorAction Stop
    Write-Host " SUCCESS" -ForegroundColor Green
    $requestId = $regResponse.data.requestId
    Write-Host "  Request ID: $requestId" -ForegroundColor Yellow
}
catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Check if admin already exists
    Write-Host ""
    Write-Host "Checking if admin already exists..." -NoNewline
    try {
        $loginTest = @{
            username = "admin@herbaltrace.com"
            password = "Admin@123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginTest -ContentType "application/json" -ErrorAction Stop
        Write-Host " YES" -ForegroundColor Green
        Write-Host ""
        Write-Host "Admin user already exists and is working!" -ForegroundColor Green
        Write-Host "Email: admin@herbaltrace.com" -ForegroundColor Yellow
        Write-Host "Password: Admin@123" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "You can use these credentials to log in to the admin panel." -ForegroundColor Cyan
        exit 0
    }
    catch {
        Write-Host " NO" -ForegroundColor Red
        Write-Host ""
        Write-Host "Admin user needs to be created manually in the database." -ForegroundColor Yellow
        Write-Host "Run the SQL script: create-initial-admin.sql" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Write-Host "Note: Since this is the first admin, we need to manually approve this request in the database." -ForegroundColor Yellow
Write-Host ""
Write-Host "Run this SQL command in your Railway database:" -ForegroundColor Cyan
Write-Host ""
Write-Host "-- Connect to Railway database and run:" -ForegroundColor Gray
Write-Host "UPDATE registration_requests SET status = 'approved', approved_date = datetime('now') WHERE email = 'admin@herbaltrace.com';" -ForegroundColor White
Write-Host ""
Write-Host "INSERT INTO users (" -ForegroundColor White
Write-Host "  id, user_id, username, email, password_hash, full_name, phone, role," -ForegroundColor White
Write-Host "  org_name, org_msp, affiliation, status, created_at" -ForegroundColor White
Write-Host ") VALUES (" -ForegroundColor White
Write-Host "  'admin-uuid-001'," -ForegroundColor White
Write-Host "  'admin-system-001'," -ForegroundColor White
Write-Host "  'admin'," -ForegroundColor White
Write-Host "  'admin@herbaltrace.com'," -ForegroundColor White
Write-Host "  '\$2a\$10\$8K1p/a0dL.6pktOKjTWrbu7KqJ.bQPMH5a3E9gNQAqKgT6jKjGCT.'," -ForegroundColor White
Write-Host "  'System Administrator'," -ForegroundColor White
Write-Host "  '+919999999999'," -ForegroundColor White
Write-Host "  'Admin'," -ForegroundColor White
Write-Host "  'AdminOrg'," -ForegroundColor White
Write-Host "  'AdminOrgMSP'," -ForegroundColor White
Write-Host "  'adminorg.department1'," -ForegroundColor White
Write-Host "  'active'," -ForegroundColor White
Write-Host "  datetime('now')" -ForegroundColor White
Write-Host ");" -ForegroundColor White
Write-Host ""
Write-Host "Credentials for the admin user:" -ForegroundColor Cyan
Write-Host "Email: admin@herbaltrace.com" -ForegroundColor Yellow
Write-Host "Password: Admin@123" -ForegroundColor Yellow
Write-Host ""
