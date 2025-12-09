# Update Chaincode Endorsement Policy from AND to OR
# This allows ANY organization to endorse, not ALL organizations

Write-Host "🔧 Updating Chaincode Endorsement Policy" -ForegroundColor Cyan
Write-Host "From: ALL MSPs must approve (AND policy)"
Write-Host "To: ANY MSP can approve (OR policy)"
Write-Host ""
Write-Host "✅ This will NOT affect existing farmer transactions!" -ForegroundColor Green
Write-Host "✅ Farmer data will remain on blockchain" -ForegroundColor Green
Write-Host "✅ Makes syncing lab/product data easier" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to cancel, or Enter to continue..."
Read-Host

$CHANNEL_NAME = "herbaltrace-channel"
$CC_NAME = "herbaltrace"
$CC_VERSION = "2.1"
$CC_SEQUENCE = 4  # Increment from current sequence 3

# Get package ID
Write-Host "`n📦 Getting chaincode package ID..." -ForegroundColor Yellow
$packageIdJson = docker exec cli peer lifecycle chaincode queryinstalled --output json 2>$null
$packageId = ($packageIdJson | ConvertFrom-Json).installed_chaincodes[0].package_id

if (-not $packageId) {
    Write-Host "❌ Could not get package ID. Is chaincode installed?" -ForegroundColor Red
    exit 1
}

Write-Host "   Package ID: $packageId" -ForegroundColor Gray

# Define the new OR policy
$POLICY = "OR('FarmersCoopMSP.peer','TestingLabsMSP.peer','ProcessorsMSP.peer','ManufacturersMSP.peer')"

# Approve for each organization
$orgs = @(
    @{Name="FarmersCoopMSP"; Peer="peer0.farmers.herbaltrace.com:7051"; Domain="farmers.herbaltrace.com"},
    @{Name="TestingLabsMSP"; Peer="peer0.labs.herbaltrace.com:9051"; Domain="labs.herbaltrace.com"},
    @{Name="ProcessorsMSP"; Peer="peer0.processors.herbaltrace.com:10051"; Domain="processors.herbaltrace.com"},
    @{Name="ManufacturersMSP"; Peer="peer0.manufacturers.herbaltrace.com:11051"; Domain="manufacturers.herbaltrace.com"}
)

$approved = 0

foreach ($org in $orgs) {
    Write-Host "`n📦 Approving for $($org.Name)..." -ForegroundColor Yellow
    
    $approveCmd = "docker exec -e CORE_PEER_LOCALMSPID=$($org.Name) " +
        "-e CORE_PEER_TLS_ENABLED=true " +
        "-e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/$($org.Domain)/peers/peer0.$($org.Domain)/tls/ca.crt " +
        "-e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/$($org.Domain)/users/Admin@$($org.Domain)/msp " +
        "-e CORE_PEER_ADDRESS=$($org.Peer) " +
        "cli peer lifecycle chaincode approveformyorg " +
        "-o orderer.herbaltrace.com:7050 " +
        "--ordererTLSHostnameOverride orderer.herbaltrace.com " +
        "--channelID $CHANNEL_NAME " +
        "--name $CC_NAME " +
        "--version $CC_VERSION " +
        "--package-id $packageId " +
        "--sequence $CC_SEQUENCE " +
        "--tls " +
        "--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem " +
        "--signature-policy `"$POLICY`""
    
    $result = Invoke-Expression $approveCmd 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $($org.Name) approved!" -ForegroundColor Green
        $approved++
    } else {
        Write-Host "   ⚠️  $($org.Name) approval had issues (may be OK if already approved)" -ForegroundColor Yellow
        Write-Host "   $result" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "`n📦 Step: Committing new policy to channel..." -ForegroundColor Yellow

$commitCmd = "docker exec -e CORE_PEER_LOCALMSPID=FarmersCoopMSP " +
    "-e CORE_PEER_TLS_ENABLED=true " +
    "-e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/farmers.herbaltrace.com/peers/peer0.farmers.herbaltrace.com/tls/ca.crt " +
    "-e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/farmers.herbaltrace.com/users/Admin@farmers.herbaltrace.com/msp " +
    "-e CORE_PEER_ADDRESS=peer0.farmers.herbaltrace.com:7051 " +
    "cli peer lifecycle chaincode commit " +
    "-o orderer.herbaltrace.com:7050 " +
    "--ordererTLSHostnameOverride orderer.herbaltrace.com " +
    "--channelID $CHANNEL_NAME " +
    "--name $CC_NAME " +
    "--version $CC_VERSION " +
    "--sequence $CC_SEQUENCE " +
    "--tls " +
    "--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem " +
    "--peerAddresses peer0.farmers.herbaltrace.com:7051 " +
    "--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/farmers.herbaltrace.com/peers/peer0.farmers.herbaltrace.com/tls/ca.crt " +
    "--peerAddresses peer0.labs.herbaltrace.com:9051 " +
    "--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/labs.herbaltrace.com/peers/peer0.labs.herbaltrace.com/tls/ca.crt " +
    "--signature-policy `"$POLICY`""

Write-Host "   Committing..." -ForegroundColor Gray
$commitResult = Invoke-Expression $commitCmd 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Policy committed!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Commit failed!" -ForegroundColor Red
    Write-Host "   $commitResult" -ForegroundColor Gray
    exit 1
}

Write-Host "`n📦 Verifying new policy..." -ForegroundColor Yellow
docker exec cli peer lifecycle chaincode querycommitted -C $CHANNEL_NAME -n $CC_NAME

Write-Host "`n🎉 SUCCESS! Endorsement policy updated!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Old policy: ALL orgs must approve (AND)" -ForegroundColor Green
Write-Host "✅ New policy: ANY org can approve (OR)" -ForegroundColor Green
Write-Host "✅ Existing farmer data: SAFE and unchanged" -ForegroundColor Green
Write-Host "✅ Lab tests and products: Can now be synced!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run sync script: cd backend; node simple-sync.js"
Write-Host "2. Verify: node quick-blockchain-status.js"
Write-Host "3. Demo: Show complete blockchain traceability!"
