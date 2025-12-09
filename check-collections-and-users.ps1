# Check Collections and Users in HerbalTrace

$BASE_URL = "http://localhost:3000/api/v1"

Write-Host "`n=== Checking HerbalTrace Data ===" -ForegroundColor Cyan
Write-Host ""

# Function to login
function Get-AuthToken {
    param($username, $password)
    
    try {
        $body = @{
            username = $username
            password = $password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
            -Method POST `
            -Body $body `
            -ContentType "application/json"
        
        return $response.data.token
    } catch {
        return $null
    }
}

# Try to login as farmer
Write-Host "1. Checking Farmer (avinashverma) collections..." -ForegroundColor Yellow
$farmerToken = Get-AuthToken -username "avinashverma" -password "HT4CAYXTEU"

if ($farmerToken) {
    Write-Host "   Farmer login successful" -ForegroundColor Green
    
    try {
        $headers = @{ "Authorization" = "Bearer $farmerToken" }
        $collections = Invoke-RestMethod -Uri "$BASE_URL/collections" `
            -Method GET `
            -Headers $headers
        
        if ($collections.data -and $collections.data.Count -gt 0) {
            Write-Host "   Found $($collections.data.Count) collection(s):" -ForegroundColor Green
            foreach ($c in $collections.data) {
                Write-Host "      - ID: $($c.id), Species: $($c.species), Qty: $($c.quantity) $($c.unit), Status: $($c.sync_status)" -ForegroundColor White
            }
        } else {
            Write-Host "   No collections found for this farmer" -ForegroundColor Red
        }
    } catch {
        Write-Host "   Failed to get collections: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   Farmer login failed" -ForegroundColor Red
}

Write-Host ""

# Try to login as admin
Write-Host "2. Checking Admin access..." -ForegroundColor Yellow
Write-Host "   Enter admin password (try 'admin123' or 'admin'): " -ForegroundColor Gray
$adminPassword = Read-Host -AsSecureString
$adminPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPassword)
)

$adminToken = Get-AuthToken -username "admin" -password $adminPasswordPlain

if ($adminToken) {
    Write-Host "   Admin login successful" -ForegroundColor Green
    
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        
        # Get all collections
        $allCollections = Invoke-RestMethod -Uri "$BASE_URL/collections" `
            -Method GET `
            -Headers $headers
        
        Write-Host "   Total collections in system: $($allCollections.data.Count)" -ForegroundColor Green
        
        if ($allCollections.data -and $allCollections.data.Count -gt 0) {
            Write-Host "`n   Collections by species:" -ForegroundColor Cyan
            $grouped = $allCollections.data | Group-Object species
            foreach ($group in $grouped) {
                Write-Host "      - $($group.Name): $($group.Count) collection(s)" -ForegroundColor White
            }
        }
        
        # Get all batches
        Write-Host ""
        $batches = Invoke-RestMethod -Uri "$BASE_URL/batches" `
            -Method GET `
            -Headers $headers
        
        Write-Host "   Total batches in system: $($batches.data.Count)" -ForegroundColor Green
        
        if ($batches.data -and $batches.data.Count -gt 0) {
            Write-Host "`n   Existing batches:" -ForegroundColor Cyan
            foreach ($b in $batches.data) {
                Write-Host "      - $($b.batch_number), Species: $($b.species), Status: $($b.status)" -ForegroundColor White
            }
        } else {
            Write-Host "   No batches created yet (need to create from collections)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "   Failed to get data: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   Admin login failed - check password" -ForegroundColor Red
}

Write-Host "`n==================================" -ForegroundColor Cyan
