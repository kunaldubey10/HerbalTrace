# 🌿 HerbalTrace - Complete Frontend Flow Guide

## 🌐 Running Services
- **Backend API**: http://localhost:3000
- **Frontend Portal**: http://localhost:3003

---

## 🔐 Login Credentials

### 👨‍💼 ADMIN
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: admin@herbaltrace.com
- **Dashboard**: http://localhost:3003/admin

### 👨‍🌾 FARMER ACCOUNTS

#### 1. Kunal
- **Username**: `kunaldubey1810`
- **Password**: `kunaldubey1810123`
- **Email**: kunaldubey1810@gmail.com
- **Phone**: 7667494346
- **Dashboard**: http://localhost:3003/farmer

#### 2. Avinash Verma
- **Username**: `avinashverma`
- **Password**: `avinashverma123`
- **Email**: avinashverma@gmail.com
- **Phone**: 6203585026
- **Dashboard**: http://localhost:3003/farmer

#### 3. Test Farmer
- **Username**: `testfarmer`
- **Password**: `testfarmer123`
- **Email**: testfarmer@test.com
- **Phone**: 9999999999
- **Dashboard**: http://localhost:3003/farmer

### 🔬 LAB ACCOUNT
- **Username**: `labtest`
- **Password**: `labtest123`
- **Name**: Indian Testing Laboratory
- **Email**: labtest@gmail.com
- **Phone**: 7905423047
- **Dashboard**: http://localhost:3003/laboratory

### 🏭 MANUFACTURER
- **Username**: `manufacturer`
- **Password**: `manufacturer123`
- **Name**: HerbalTrace Manufacturer
- **Email**: manufacturer@herbaltrace.com
- **Phone**: 9999999999
- **Dashboard**: http://localhost:3003/manufacturer

---

## 📱 Complete Frontend Routes

### Public Pages (No Login Required)
- **Home**: http://localhost:3003/
- **About**: http://localhost:3003/about
- **Process**: http://localhost:3003/process
- **Offerings**: http://localhost:3003/offerings
- **Contact**: http://localhost:3003/contact
- **Track Product**: http://localhost:3003/track

### Authentication Pages
- **Role Selection**: http://localhost:3003/select-role
- **Register**: http://localhost:3003/register
- **Login**: http://localhost:3003/login

### Role-Based Dashboards (Login Required)
- **Admin Dashboard**: http://localhost:3003/admin
- **Farmer Dashboard**: http://localhost:3003/farmer
- **Lab Dashboard**: http://localhost:3003/laboratory
- **Processor Dashboard**: http://localhost:3003/processor
- **Manufacturer Dashboard**: http://localhost:3003/manufacturer
- **Regulator Dashboard**: http://localhost:3003/regulator

---

## 🔄 Complete Workflow by Role

### 👨‍🌾 FARMER WORKFLOW
1. **Login** at http://localhost:3003/login
   - Use: `kunaldubey1810` / `kunaldubey1810123`
2. **Dashboard** opens at http://localhost:3003/farmer
3. **Actions Available**:
   - ✅ Create new herb collection
   - ✅ View collection history
   - ✅ Upload collection images
   - ✅ Record harvest details (date, method, quantity)
   - ✅ Track collection status
   - ✅ View profile and farm details

### 🔬 LAB WORKFLOW
1. **Login** at http://localhost:3003/login
   - Use: `labtest` / `labtest123`
2. **Dashboard** opens at http://localhost:3003/laboratory
3. **Actions Available**:
   - ✅ View pending batches for testing
   - ✅ Conduct quality tests
   - ✅ Record test results (PASS/FAIL)
   - ✅ Upload test certificates
   - ✅ Generate quality reports
   - ✅ View test history

### 🏭 MANUFACTURER WORKFLOW
1. **Login** at http://localhost:3003/login
   - Use: `manufacturer` / `manufacturer123`
2. **Dashboard** opens at http://localhost:3003/manufacturer
3. **Actions Available**:
   - ✅ View quality-tested batches
   - ✅ Create final products from batches
   - ✅ Generate QR codes for products
   - ✅ Record manufacturing details
   - ✅ Manage product inventory
   - ✅ View production history

### 👨‍💼 ADMIN WORKFLOW
1. **Login** at http://localhost:3003/login
   - Use: `admin` / `admin123`
2. **Dashboard** opens at http://localhost:3003/admin
3. **Actions Available**:
   - ✅ Manage all users (create, edit, delete)
   - ✅ View system analytics
   - ✅ Monitor all collections, batches, products
   - ✅ Access blockchain records
   - ✅ Generate system reports
   - ✅ Configure system settings

---

## 📊 Complete Supply Chain Flow

### Step 1: Farmer Collection 🌾
**Page**: http://localhost:3003/farmer
1. Farmer logs in
2. Creates new collection with details:
   - Herb species (Tulsi, Ashwagandha, etc.)
   - Quantity and unit
   - Harvest date
   - Harvest method (manual/mechanical)
   - Part collected (leaves/roots/flowers)
   - Location (GPS coordinates)
   - Photos
3. Collection gets blockchain transaction ID
4. Status: **Collected**

### Step 2: Batch Creation 📦
**Backend Process** (Can be done via API or Admin)
1. Multiple farmer collections combined into batch
2. Batch created with:
   - Batch number (e.g., BATCH-TULSI-20251207-8453)
   - Species
   - Total quantity
   - Source collections
3. Status: **Created** → **Ready for Testing**

### Step 3: Quality Testing 🔬
**Page**: http://localhost:3003/laboratory
1. Lab technician logs in
2. Selects batch for testing
3. Conducts tests:
   - Moisture content
   - Heavy metals
   - Pesticide residues
   - Microbial contamination
   - Active compounds
4. Records results (PASS/FAIL)
5. Uploads certificates
6. Status: **Quality Tested**

### Step 4: Manufacturing 🏭
**Page**: http://localhost:3003/manufacturer
1. Manufacturer logs in
2. Views quality-tested batches
3. Selects batch for production
4. Creates product:
   - Product name (e.g., Premium Tulsi Extract)
   - Product type (powder/extract/capsule/oil)
   - Quantity produced
   - Manufacture date
   - Expiry date
   - Processing steps
5. **QR Code Generated Automatically**
6. QR saved as PNG image
7. Status: **Manufactured**

### Step 5: QR Code Verification 📱
**Page**: http://localhost:3000/verify/{QR_CODE}
1. Customer scans QR code on product
2. Verification page loads with:
   - ✅ Product authenticity badge
   - 📦 Product information
   - 🌾 Batch details
   - 👨‍🌾 Farm origins (farmer names, locations)
   - 🔬 Quality test results
   - 📋 Complete traceability timeline
3. Elegant green/white themed display
4. Mobile responsive

---

## 🎯 Quick Start Guide

### For Testing Complete Flow:

1. **Start Farmer Collection**:
   ```
   Login: kunaldubey1810 / kunaldubey1810123
   URL: http://localhost:3003/farmer
   Create a new herb collection
   ```

2. **Create Batch** (Backend Script):
   ```bash
   cd backend
   node create-batch-from-collections.js
   ```

3. **Lab Testing**:
   ```
   Login: labtest / labtest123
   URL: http://localhost:3003/laboratory
   Test the batch and mark PASS
   ```

4. **Manufacture Product**:
   ```bash
   cd backend
   node test-create-product-with-qr.js
   ```
   OR
   ```
   Login: manufacturer / manufacturer123
   URL: http://localhost:3003/manufacturer
   Create product from batch
   ```

5. **Verify QR Code**:
   ```
   Scan generated QR code PNG
   OR visit: http://localhost:3000/verify/{QR_CODE}
   ```

---

## 🔑 API Authentication

All API calls require Bearer token:

### Get Token:
```bash
POST http://localhost:3000/api/v1/auth/login
Body: {
  "username": "manufacturer",
  "password": "manufacturer123"
}
```

### Use Token:
```bash
Authorization: Bearer {token}
```

---

## 📱 Mobile Access

### For Phone Testing:
1. **Find your computer's IP address**:
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Connect phone to same WiFi**

3. **Access from phone**:
   - Frontend: `http://{YOUR_IP}:3003`
   - Backend: `http://{YOUR_IP}:3000`
   - QR Verify: `http://{YOUR_IP}:3000/verify/{QR_CODE}`

---

## 🎨 UI Features

### Farmer Dashboard:
- 🌿 Collection creation form
- 📸 Image upload
- 📍 GPS location capture
- 📊 Collection history table
- 🔗 Blockchain transaction links

### Lab Dashboard:
- 🧪 Pending tests queue
- ✅ Test result forms
- 📄 Certificate upload
- 📈 Test history
- 📊 Pass/fail statistics

### Manufacturer Dashboard:
- 📦 Available batches list
- 🏭 Product creation form
- 📱 QR code generation
- 🖼️ Product images
- 📊 Production analytics

### Verification Page:
- ✓ Green verified badge
- 📦 Product details card
- 🌾 Batch information
- 👨‍🌾 Farm traceability
- 🔬 Quality certificates
- 📋 Timeline visualization

---

## 🔧 Troubleshooting

### If Login Fails:
1. Check backend is running: http://localhost:3000/api/v1/health
2. Verify credentials in database
3. Check browser console for errors

### If Dashboard Not Loading:
1. Check token in localStorage
2. Verify role matches route
3. Clear browser cache

### If QR Not Displaying Product:
1. Verify product exists in database
2. Check QR code format: `QR-{timestamp}-{hash}`
3. Test API: `http://localhost:3000/api/v1/qr/verify/{QR_CODE}`

---

## 📞 Support

For issues or questions:
- Check browser console (F12)
- Check backend logs
- Verify database has data
- Ensure both servers running

---

**Last Updated**: December 8, 2025
**Version**: 1.0.0
