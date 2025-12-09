# Quick API Test
$IP = "172.28.192.1"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing API at http://$IP`:3000" -ForegroundColor Yellow
Write-Host ""

try {
    $result = Invoke-RestMethod -Uri "http://$IP`:3000/" -TimeoutSec 3
    Write-Host "API is ONLINE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Name: $($result.name)" -ForegroundColor Gray
    Write-Host "  Version: $($result.version)" -ForegroundColor Gray
    Write-Host "  Blockchain: $($result.blockchain.chaincode)" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your Flutter app configuration:" -ForegroundColor White
    Write-Host ""
    Write-Host "  BASE_URL = 'http://$IP`:3000/api/v1'" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Test credentials:" -ForegroundColor White
    Write-Host "  Username: farmer-1765221082597-p4a9" -ForegroundColor Yellow
    Write-Host "  Password: Farmer123" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "API is OFFLINE" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Make sure backend is running with: npm start" -ForegroundColor Yellow
    Write-Host ""
}
