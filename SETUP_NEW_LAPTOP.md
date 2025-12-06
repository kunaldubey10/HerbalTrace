# HerbalTrace - Setup Guide for New Laptop

## Prerequisites
- **Node.js** 16+ and npm
- **Docker Desktop** (for blockchain network)
- **Git**
- **Go** 1.20+ (for chaincode development)

## Clone Repository
```bash
git clone https://github.com/kunaldubey10/Herb.git
cd Herb/HerbalTrace
```

## Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Build backend:
```bash
npm run build
```

## Frontend Setup
```bash
cd web-portal
npm install
```

## Blockchain Network Setup

### Generate Crypto Materials
The crypto materials and wallet files are excluded from git for security. You'll need to regenerate them:

```bash
cd network
./deploy-network.sh
```

This script will:
- Generate certificates and keys for all organizations
- Create MSP (Membership Service Provider) configurations
- Set up orderers and peers
- Create the channel
- Deploy the chaincode

### Create Admin Wallets
```bash
cd backend
node create-admin.js
```

### Create Season Windows
```bash
node create-season-windows.js
```

## Start Services

### Terminal 1: Start Blockchain Network
```bash
cd network/docker
docker-compose -f docker-compose-ca.yaml up -d
docker-compose -f docker-compose-herbaltrace.yaml up -d
```

Verify containers (should see 21 containers):
```bash
docker ps
```

### Terminal 2: Start Backend
```bash
cd backend
node dist/index.js
```

Verify backend: http://localhost:3000/health

### Terminal 3: Start Frontend
```bash
cd web-portal
npm run dev
```

Access frontend: http://localhost:3002/

## Test User Credentials
**Username**: avinashverma  
**Password**: HT4CAYXTEU  
**Role**: Farmer  
**Location**: Greater Noida, UttarPradesh

## Quick Commands

### Stop All Services
```bash
cd HerbalTrace
./stop-all-services.ps1
```

### Start All Services
```bash
cd HerbalTrace
./start-all-services.ps1
```

### Check Network Status
```bash
cd HerbalTrace
./check-status.ps1
```

## Troubleshooting

### Blockchain Network Not Starting
```bash
# Clean up and restart
docker-compose -f network/docker/docker-compose-herbaltrace.yaml down -v
docker-compose -f network/docker/docker-compose-ca.yaml down -v
./network/deploy-network.sh
```

### Backend Connection Errors
- Verify all 21 Docker containers are running
- Check `backend/wallet/` directory exists and has admin identities
- Verify `backend/data/herbaltrace.db` exists

### Frontend Collection Sync Fails
- Backend must be running on port 3000
- Blockchain network must be fully operational
- Check backend logs in `backend/logs/error.log`

## Important Features

### Species Name Normalization
The backend automatically normalizes species names:
- Frontend: "Tulsi (Holy Basil)"
- Blockchain: "Tulsi"

This fix is in `backend/src/routes/collection.routes.ts`

### Blockchain Status Badges
Frontend displays real-time sync status:
- ✅ Synced to Blockchain
- 🔄 Syncing...
- ❌ Blockchain Sync Failed

### QR Code Generation
Available in Manufacturer Dashboard:
- Create Product & Generate QR Code
- Download QR codes
- Complete traceability chain

## Architecture

**Backend**: Node.js + TypeScript + Express  
**Frontend**: React + Vite + TailwindCSS  
**Blockchain**: Hyperledger Fabric 2.5  
**Database**: SQLite  
**Chaincode**: Go

**Organizations**:
- Farmers
- FarmersCoop
- Labs
- TestingLabs
- Processors
- Manufacturers

## Documentation
See the `/docs` folder for detailed guides:
- `PROJECT_IMPLEMENTATION_GUIDE.md`
- `COMPLETE_WORKFLOW_GUIDE.md`
- `START_TESTING_GUIDE.md`
- `BLOCKCHAIN_INTEGRATION_STATUS.md`

## Support
For issues, check:
1. Backend logs: `backend/logs/`
2. Docker container logs: `docker logs <container-name>`
3. Network status: `./check-status.ps1`
