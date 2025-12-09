# Get Lab User Password
Write-Host "`n=== Lab User Login Credentials ===" -ForegroundColor Cyan

# Login as admin to get lab user details
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✓ Admin login successful" -ForegroundColor Green
    
    # Get all users
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users" -Method GET -Headers @{Authorization="Bearer $token"}
    
    # Find lab user
    $labUser = $usersResponse.data | Where-Object { $_.role -eq 'lab' -or $_.username -like '*lab*' }
    
    if ($labUser) {
        Write-Host "`nUsername: $($labUser.username)" -ForegroundColor Yellow
        Write-Host "Email:    $($labUser.email)" -ForegroundColor Yellow
        Write-Host "Role:     $($labUser.role)" -ForegroundColor Yellow
        Write-Host "Name:     $($labUser.full_name)" -ForegroundColor Yellow
        Write-Host "`nNote: Password is stored as hash. Try common passwords like:" -ForegroundColor White
        Write-Host "  - lab123" -ForegroundColor Cyan
        Write-Host "  - labtest" -ForegroundColor Cyan
        Write-Host "  - password" -ForegroundColor Cyan
    } else {
        Write-Host "`nNo lab user found!" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure backend is running on port 3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor White
Write-Host ""
