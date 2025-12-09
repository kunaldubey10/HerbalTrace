# Quick batch creator - creates batch from synced Tulsi collection
$ErrorActionPreference = "Stop"

Write-Host "`n=== Creating Batch from Tulsi Collection ===" -ForegroundColor Cyan

try {
    # Login as admin
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.data.token
    Write-Host "Login successful" -ForegroundColor Green
    
    # Create batch from Tulsi collection
    $batchBody = @{
        species = "Tulsi"
        collectionIds = @("COL-1764969995371-eae0d521")
        notes = "Tulsi batch for lab testing"
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/batches" `
            -Method POST `
            -Headers $headers `
            -Body $batchBody `
            -ContentType "application/json"
    } catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "`nAPI Error: $($errorDetails.message)" -ForegroundColor Red
        throw
    }
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  BATCH CREATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Batch Number: $($result.data.batch_number)" -ForegroundColor Cyan
    Write-Host "Species: $($result.data.species)" -ForegroundColor White
    Write-Host "Quantity: $($result.data.total_quantity) $($result.data.unit)" -ForegroundColor White
    Write-Host "Collections: $($result.data.collection_count)" -ForegroundColor White
    Write-Host "Status: $($result.data.status)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open Lab dashboard: http://localhost:3003" -ForegroundColor White
    Write-Host "2. Login as lab user (labtest)" -ForegroundColor White
    Write-Host "3. Click 'Test Queue' tab" -ForegroundColor White
    Write-Host "4. You will see the Tulsi batch!" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure backend is running on http://localhost:3000" -ForegroundColor Yellow
    exit 1
}
