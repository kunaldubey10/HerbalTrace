# HerbalTrace System Credentials

## System Login Credentials

### 1. Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin
- **Organization**: HerbalTrace
- **Permissions**: Full system access, approve/reject registrations, manage all entities

### 2. Farmer User
- **Username**: `avinashverma`
- **Password**: `avinash123`
- **Role**: Farmer
- **Organization**: FarmersCoop
- **Permissions**: Submit collection events, view own batches, upload harvest data

### 3. Lab User
- **Username**: `labtest`
- **Password**: `lab123`
- **Role**: Lab
- **Organization**: LabsCoop
- **Permissions**: Create QC tests, submit test results, generate certificates

### 4. Manufacturer User
- **Username**: `manufacturer`
- **Password**: `manufacturer123`
- **Role**: Manufacturer
- **Organization**: Manufacturers
- **Permissions**: Create products, generate QR codes, view supply chain data

---

## API Endpoints for Authentication

### Login Endpoint
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "user": {
      "userId": "admin-001",
      "username": "admin",
      "email": "admin@herbaltrace.com",
      "fullName": "System Administrator",
      "orgName": "HerbalTrace",
      "role": "Admin"
    }
  }
}
```

### Use Token in Subsequent Requests
```
Authorization: Bearer {token}
```

---

## Complete Workflow

### 1. Admin Workflow
1. **Login** as admin
2. **View registration requests**: `GET /api/v1/auth/registration-requests`
3. **Approve requests**: `POST /api/v1/auth/registration-requests/:id/approve`
4. **Monitor system**: Access all dashboards and analytics

### 2. Farmer Workflow
1. **Login** as avinashverma
2. **Submit collection**: `POST /api/v1/collections`
3. **View batches**: `GET /api/v1/batches`
4. **Track harvest limits**: View dashboard

### 3. Lab Workflow
1. **Login** as labtest
2. **View assigned batches**: `GET /api/v1/qc/tests?status=pending`
3. **Create QC test**: `POST /api/v1/qc/tests`
4. **Submit results**: `POST /api/v1/qc/tests/:id/results`
5. **Generate certificate**: `POST /api/v1/qc/tests/:id/certificate`

### 4. Manufacturer Workflow
1. **Login** as manufacturer
2. **View tested batches**: `GET /api/v1/batches?status=quality_tested`
3. **Create product**: `POST /api/v1/manufacturer/products`
4. **Generate QR code**: Automatically generated with product
5. **View provenance**: Product includes full supply chain data

### 5. Consumer Workflow (No Login Required)
1. **Scan QR code** on product
2. **Verify authenticity**: `GET /api/v1/qr/verify/:qrCode`
3. **View provenance**: See complete journey from farm to product

---

## Database Quick Reference

**Database Location**: `backend/data/herbaltrace.db`

**Key Tables**:
- `users` - All system users
- `batches` - Batch aggregations
- `collection_events_cache` - Farmer harvests
- `qc_tests` - Lab test records
- `qc_certificates` - Test certificates
- `products` - Manufactured products

---

## Blockchain Identities

Each user role maps to a Fabric organization:
- **Admin** → HerbalTrace (observer)
- **Farmer** → FarmersCoop
- **Lab** → TestingLabs / LabsCoop
- **Manufacturer** → Manufacturers

**Wallet Location**: `network/wallet/`

---

## Quick Testing Commands

### Check Users
```bash
cd backend
node -e "const db = require('better-sqlite3')('data/herbaltrace.db'); db.prepare('SELECT username, role, status FROM users WHERE status=\"active\"').all().forEach(u => console.log(u)); db.close();"
```

### Reset Passwords
```bash
cd backend
node setup-credentials.js
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Important Notes

1. **JWT Secret**: Stored in `.env` file or defaults to development key
2. **Token Expiry**: 24 hours for access token, 7 days for refresh token
3. **Password Hashing**: Uses bcrypt with 10 rounds
4. **Blockchain Sync**: Happens automatically on collection/test/product creation
5. **QR Codes**: Signed with HMAC SHA-256 for tamper protection

---

## Support

For issues or questions:
1. Check backend logs: `backend/logs/`
2. Verify blockchain network: `cd network && docker ps`
3. Test database: `cd backend && node check-db.js`
4. Check blockchain data: `cd backend && node check-blockchain-data.js`
