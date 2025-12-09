# Script to create a batch from farmer collections
# This helps convert farmer collections into batches that appear in Lab Test Queue

Write-Host "=== HerbalTrace: Create Batch from Collections ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BASE_URL = "http://localhost:3000/api/v1"

# Read admin credentials from user
Write-Host "Enter Admin credentials:" -ForegroundColor Yellow
$username = Read-Host "Username (e.g., admin)"
$password = Read-Host "Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# Login to get token
Write-Host "`nLogging in..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = $username
        password = $passwordPlain
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.data.token
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit 1
}

# Get all collections
Write-Host "`nFetching collections..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $collectionsResponse = Invoke-RestMethod -Uri "$BASE_URL/collections" `
        -Method GET `
        -Headers $headers
    
    $collections = $collectionsResponse.data
    
    if (-not $collections -or $collections.Count -eq 0) {
        Write-Host "No collections found!" -ForegroundColor Red
        Write-Host "Farmer needs to create collections first." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Found $($collections.Count) collection(s)" -ForegroundColor Green
    Write-Host ""
    
    # Group by species
    $speciesGroups = $collections | Group-Object species
    
    foreach ($group in $speciesGroups) {
        Write-Host "Species: $($group.Name)" -ForegroundColor Cyan
        foreach ($collection in $group.Group) {
            Write-Host "  - ID: $($collection.id), Farmer: $($collection.farmer_name), Qty: $($collection.quantity) $($collection.unit)" -ForegroundColor White
        }
        Write-Host ""
    }
    
} catch {
    Write-Host "Failed to fetch collections: $_" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Ask user to select species
Write-Host "Select species to create batch:" -ForegroundColor Yellow
$speciesList = $speciesGroups.Name | Sort-Object
for ($i = 0; $i -lt $speciesList.Count; $i++) {
    Write-Host "  [$($i+1)] $($speciesList[$i])"
}
$selection = Read-Host "Enter number"
$selectedSpecies = $speciesList[[int]$selection - 1]

# Get collections for selected species
$selectedCollections = $collections | Where-Object { $_.species -eq $selectedSpecies }

Write-Host "`nSelected collections for '$selectedSpecies':" -ForegroundColor Cyan
$selectedIds = @()
foreach ($collection in $selectedCollections) {
    Write-Host "  - ID: $($collection.id), Farmer: $($collection.farmer_name), Qty: $($collection.quantity) $($collection.unit)" -ForegroundColor White
    $selectedIds += $collection.id
}

Write-Host ""
$confirm = Read-Host "Create batch from these $($selectedIds.Count) collection(s)? (yes/no)"

if ($confirm -ne "yes" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Create batch
Write-Host "`nCreating batch..." -ForegroundColor Yellow
try {
    $batchBody = @{
        species = $selectedSpecies
        collectionIds = $selectedIds
        notes = "Batch created from PowerShell script"
    } | ConvertTo-Json
    
    $batchResponse = Invoke-RestMethod -Uri "$BASE_URL/batches" `
        -Method POST `
        -Headers $headers `
        -Body $batchBody `
        -ContentType "application/json"
    
    $batch = $batchResponse.data
    
    Write-Host "Batch created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Batch Details:" -ForegroundColor Cyan
    Write-Host "  - Batch Number: $($batch.batch_number)" -ForegroundColor White
    Write-Host "  - Species: $($batch.species)" -ForegroundColor White
    Write-Host "  - Total Quantity: $($batch.total_quantity) $($batch.unit)" -ForegroundColor White
    Write-Host "  - Collections: $($batch.collection_count)" -ForegroundColor White
    Write-Host "  - Status: $($batch.status)" -ForegroundColor White
    Write-Host ""
    Write-Host "SUCCESS: This batch will now appear in the Lab Test Queue!" -ForegroundColor Green
    
} catch {
    Write-Host "Failed to create batch: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
    exit 1
}
