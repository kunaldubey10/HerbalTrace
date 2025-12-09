# Create a test batch ready for manufacturer

$baseUrl = "http://localhost:3000/api/v1"

Write-Host "`n=== Creating Test Batch for Manufacturer ===" -ForegroundColor Cyan

# Step 1: Login as farmer
Write-Host "`n1. Logging in as farmer..." -ForegroundColor Yellow
$loginBody = @{
    username = "kunaldubey1810"
    password = "kunaldubey1810123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$farmerToken = $loginResponse.data.token
$farmerId = $loginResponse.data.user.id

Write-Host "✓ Logged in as farmer (ID: $farmerId)" -ForegroundColor Green

# Step 2: Create collection
Write-Host "`n2. Creating collection event..." -ForegroundColor Yellow
$collectionBody = @{
    species = "Ashwagandha"
    quantity = 50.5
    latitude = 28.6139
    longitude = 77.2090
    harvestDate = "2024-01-15"
    farmerId = $farmerId
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $farmerToken"
    "Content-Type" = "application/json"
}

$collectionResponse = Invoke-RestMethod -Uri "$baseUrl/collections" -Method POST -Body $collectionBody -Headers $headers -ContentType "application/json"
$collectionId = $collectionResponse.data.collection.id

Write-Host "✓ Collection created (ID: $collectionId)" -ForegroundColor Green

# Step 3: Login as admin to create batch
Write-Host "`n3. Logging in as admin..." -ForegroundColor Yellow
$adminLoginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminLoginResponse.data.token

Write-Host "✓ Logged in as admin" -ForegroundColor Green

# Step 4: Create batch from collection
Write-Host "`n4. Creating batch from collection..." -ForegroundColor Yellow
$batchBody = @{
    species = "Ashwagandha"
    collectionIds = @($collectionId)
    targetQuantity = 50
    notes = "Test batch for manufacturer"
} | ConvertTo-Json

$batchHeaders = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

$batchResponse = Invoke-RestMethod -Uri "$baseUrl/batches" -Method POST -Body $batchBody -Headers $batchHeaders -ContentType "application/json"
$batchId = $batchResponse.data.batch.id
$batchNumber = $batchResponse.data.batch.batch_number

Write-Host "✓ Batch created (ID: $batchId, Number: $batchNumber)" -ForegroundColor Green

# Step 5: Login as lab
Write-Host "`n5. Logging in as lab..." -ForegroundColor Yellow
$labLoginBody = @{
    username = "labtest"
    password = "labtest123"
} | ConvertTo-Json

$labLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $labLoginBody -ContentType "application/json"
$labToken = $labLoginResponse.data.token
$labId = $labLoginResponse.data.user.id

Write-Host "✓ Logged in as lab (ID: $labId)" -ForegroundColor Green

# Step 6: Create QC test
Write-Host "`n6. Creating QC test..." -ForegroundColor Yellow
$qcBody = @{
    batchNumber = $batchNumber
    testType = "quality"
    testParameters = @{
        purity = 98.5
        moisture = 5.2
        heavyMetals = 0.01
        microbial = "Pass"
    }
    result = "PASS"
    testedBy = $labId
    notes = "Quality test passed - ready for manufacturing"
} | ConvertTo-Json

$qcHeaders = @{
    "Authorization" = "Bearer $labToken"
    "Content-Type" = "application/json"
}

$qcResponse = Invoke-RestMethod -Uri "$baseUrl/qc" -Method POST -Body $qcBody -Headers $qcHeaders -ContentType "application/json"

Write-Host "✓ QC test completed - Batch status: quality_tested" -ForegroundColor Green

# Summary
Write-Host "`n=== Test Batch Ready for Manufacturer ===" -ForegroundColor Cyan
Write-Host "Batch Number: $batchNumber" -ForegroundColor White
Write-Host "Batch ID: $batchId" -ForegroundColor White
Write-Host "Status: quality_tested" -ForegroundColor Green
Write-Host "Species: Ashwagandha" -ForegroundColor White
Write-Host "Quantity: 50.5 kg" -ForegroundColor White
Write-Host "`nManufacturer can now:" -ForegroundColor Yellow
Write-Host "- Login with: manufacturer / manufacturer123" -ForegroundColor White
Write-Host "- See this batch in 'Processed Batches' tab" -ForegroundColor White
Write-Host "- Create product from this batch" -ForegroundColor White
Write-Host "- QR code will be auto-generated" -ForegroundColor White
