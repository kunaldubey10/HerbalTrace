# Test Lab Batches Visibility
Write-Host "`n=== Testing Lab Dashboard Batch Visibility ===" -ForegroundColor Cyan

# Login as lab user
$loginBody = @{
    username = "labtest"
    password = "lab123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    
    Write-Host "`n✓ Lab User Logged In" -ForegroundColor Green
    Write-Host "  Name: $($loginResponse.data.user.full_name)" -ForegroundColor White
    Write-Host "  Username: $($loginResponse.data.user.username)" -ForegroundColor White
    Write-Host "  Role: $($loginResponse.data.user.role)" -ForegroundColor White
    
    # Fetch all batches
    $batchesResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/batches" -Method GET -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`n=== All Batches from API ===" -ForegroundColor Yellow
    Write-Host "Total batches: $($batchesResponse.data.Count)" -ForegroundColor White
    
    if ($batchesResponse.data.Count -gt 0) {
        $batchesResponse.data | ForEach-Object {
            Write-Host "`n----------------------------------------" -ForegroundColor Gray
            Write-Host "Batch Number: $($_.batch_number)" -ForegroundColor Cyan
            Write-Host "  Species: $($_.species)" -ForegroundColor White
            Write-Host "  Status: $($_.status)" -ForegroundColor White
            Write-Host "  Quantity: $($_.total_quantity) $($_.unit)" -ForegroundColor White
            Write-Host "  Collections: $($_.collection_count)" -ForegroundColor White
            Write-Host "  Created: $($_.created_at)" -ForegroundColor Gray
            Write-Host "  Assigned To: $($_.assigned_to)" -ForegroundColor Gray
        }
        
        # Filter batches that should appear in Lab Test Queue
        # Based on LabDashboard.jsx: status = created, assigned, quality_testing, or quality_tested
        $labBatches = $batchesResponse.data | Where-Object { 
            $_.status -eq 'created' -or 
            $_.status -eq 'assigned' -or 
            $_.status -eq 'quality_testing' -or 
            $_.status -eq 'quality_tested' 
        }
        
        Write-Host "`n=== Batches That SHOULD Appear in Lab Dashboard ===" -ForegroundColor Green
        Write-Host "Filtered count: $($labBatches.Count)" -ForegroundColor White
        
        if ($labBatches.Count -gt 0) {
            $labBatches | ForEach-Object {
                Write-Host "  ✓ $($_.batch_number) - $($_.species) - $($_.status)" -ForegroundColor Green
            }
            
            Write-Host "`n=== RESULT ===" -ForegroundColor Cyan
            Write-Host "✓ Batch(es) WILL appear in Lab Test Queue" -ForegroundColor Green
            Write-Host "`nAccess Lab Dashboard at:" -ForegroundColor Yellow
            Write-Host "  http://localhost:3004" -ForegroundColor Cyan
            Write-Host "`nLogin with:" -ForegroundColor Yellow
            Write-Host "  Username: labtest" -ForegroundColor White
            Write-Host "  Password: lab123" -ForegroundColor White
        } else {
            Write-Host "  ✗ No batches match Lab filter criteria" -ForegroundColor Red
        }
    } else {
        Write-Host "`n✗ No batches found in database!" -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure backend is running on port 3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================"
Write-Host ""
