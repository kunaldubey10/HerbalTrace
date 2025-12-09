# Test Manufacturer Product Creation

$baseUrl = "http://localhost:3000/api/v1"

Write-Host "`n=== Testing Manufacturer Product Creation ===" -ForegroundColor Cyan

# Step 1: Login
Write-Host "`n1. Logging in as manufacturer..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "manufacturer"
        password = "manufacturer123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "   ✓ Login successful" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Check batches
Write-Host "`n2. Checking quality-tested batches..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $batchesResponse = Invoke-RestMethod -Uri "$baseUrl/batches?status=quality_tested" -Headers $headers -Method GET
    $batches = $batchesResponse.data
    
    Write-Host "   ✓ Found $($batches.Count) quality-tested batch(es)" -ForegroundColor Green
    
    if ($batches.Count -eq 0) {
        Write-Host "   ⚠ No quality-tested batches available" -ForegroundColor Yellow
        exit 0
    }
    
    $batch = $batches[0]
    Write-Host "   Using batch: $($batch.batch_number) ($($batch.species), $($batch.total_quantity) $($batch.unit))" -ForegroundColor White
    
} catch {
    Write-Host "   ✗ Failed to fetch batches: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Create product
Write-Host "`n3. Creating product..." -ForegroundColor Yellow
try {
    $productBody = @{
        batchId = $batch.id
        productName = "Organic $($batch.species) Powder"
        productType = "powder"
        quantity = [double]$batch.total_quantity
        unit = $batch.unit
        manufactureDate = (Get-Date).ToString("yyyy-MM-dd")
        expiryDate = (Get-Date).AddMonths(24).ToString("yyyy-MM-dd")
        ingredients = @("Pure $($batch.species) Leaf Powder", "Organic $($batch.species) Extract")
        certifications = @("Organic", "GMP")
        processingSteps = @(
            @{
                processType = "Drying"
                temperature = 60
                duration = 24
                equipment = "Industrial Dryer"
                notes = "Sun dried"
            },
            @{
                processType = "Grinding"
                temperature = 25
                duration = 2
                equipment = "Grinder"
                notes = "Fine powder"
            },
            @{
                processType = "Packaging"
                temperature = 20
                duration = 1
                equipment = "Sealing Machine"
                notes = "Sealed in bottle"
            }
        )
    } | ConvertTo-Json -Depth 10

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $productResponse = Invoke-RestMethod -Uri "$baseUrl/manufacturer/products" -Method POST -Headers $headers -Body $productBody -ContentType "application/json"
    
    Write-Host "   ✓ Product created successfully!" -ForegroundColor Green
    Write-Host "   Product ID: $($productResponse.data.product.id)" -ForegroundColor White
    Write-Host "   QR Code: $($productResponse.data.qrCode)" -ForegroundColor White
    Write-Host "   Blockchain: $($productResponse.data.blockchainTxId)" -ForegroundColor White
    
    Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
    Write-Host "Product created with auto-generated QR code!" -ForegroundColor Green
    Write-Host "Visit: http://localhost:3000/verify/$($productResponse.data.qrCode)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ✗ Product creation failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Details: $($errorObj.message)" -ForegroundColor Red
    }
    
    exit 1
}
