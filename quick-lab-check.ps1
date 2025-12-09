# Quick Lab Batch Check
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body (@{username="labtest";password="lab123"} | ConvertTo-Json) -ContentType "application/json"
$token = $login.data.token

Write-Host "Lab User: $($login.data.user.full_name)" -ForegroundColor Cyan

$batches = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/batches" -Method GET -Headers @{Authorization="Bearer $token"}

Write-Host "Total Batches: $($batches.data.Count)" -ForegroundColor Yellow

$batches.data | ForEach-Object {
    Write-Host "Batch: $($_.batch_number) | Status: $($_.status) | Species: $($_.species)" -ForegroundColor White
}

Write-Host "`nFrontend URL: http://localhost:3004" -ForegroundColor Green
Write-Host "Login: labtest / lab123" -ForegroundColor Green
