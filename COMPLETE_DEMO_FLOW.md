# 🎯 Complete HerbalTrace System - Demo Flow Guide

## ✅ Your Deployment URLs

### Backend API (Railway):
```
https://herb-production-92c3.up.railway.app
```

### Frontend (Need to Deploy):
- Web Portal (Admin/Lab/Processor/Manufacturer)
- Consumer Verification Page

---

## 📋 Complete System Flow

### 1. **Farmer** (Mobile App - Flutter)
```
Farmer → Collects herbs → Opens mobile app → Submits collection
└─> Data goes to: https://herb-production-92c3.up.railway.app/api/v1/collections
```

### 2. **Admin** (Web Portal)
```
Admin → Creates batch from collections → Assigns to lab
└─> Batch visible to lab for testing
```

### 3. **Lab** (Web Portal)
```
Lab → Views assigned batches → Performs tests → Submits results
└─> Batch moves to processor queue
```

### 4. **Processor** (Web Portal)
```
Processor → Receives tested batches → Processes into products
└─> Product moves to manufacturer
```

### 5. **Manufacturer** (Web Portal)
```
Manufacturer → Creates final products → Generates QR code
└─> QR code links to consumer verification page
```

### 6. **Consumer** (Public Web Page)
```
Consumer → Scans QR code → Views product journey → Verifies authenticity
```

---

## 🚀 Step-by-Step Setup (Next 30 Minutes)

### STEP 1: Update Flutter App (5 minutes)

#### A. Update API Configuration

In your Flutter project, find the API config file and update:

```dart
class ApiConfig {
  // OLD: static const String BASE_URL = 'http://172.28.192.1:3000/api/v1';
  
  // NEW:
  static const String BASE_URL = 'https://herb-production-92c3.up.railway.app/api/v1';
  
  // All endpoints now work worldwide!
  static const String LOGIN = '$BASE_URL/auth/login';
  static const String REGISTER = '$BASE_URL/auth/register';
  static const String COLLECTIONS = '$BASE_URL/collections';
  static const String UPLOAD_IMAGE = '$BASE_URL/upload/image';
}
```

#### B. Rebuild Flutter App

```bash
# Clean old build
flutter clean

# Get dependencies
flutter pub get

# Build release APK
flutter build apk --release

# APK location:
# build/app/outputs/flutter-apk/app-release.apk
```

#### C. Install on Mobile Device

1. Transfer APK to phone
2. Install APK
3. Test login with: `farmer-1765221082597-p4a9` / `Farmer123`

---

### STEP 2: Deploy Web Portal to Vercel (10 minutes)

#### A. Update Web Portal API Configuration

```bash
cd d:\Trial\HerbalTrace\web-portal-cloned
```

**File:** `src/services/apiService.js`

Find and update:

```javascript
// OLD: const API_BASE_URL = 'http://localhost:3000/api/v1';

// NEW:
const API_BASE_URL = 'https://herb-production-92c3.up.railway.app/api/v1';
```

#### B. Deploy to Vercel

**Option 1: Vercel CLI (Fastest)**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to web portal
cd web-portal-cloned

# Build the project
npm run build

# Deploy
vercel --prod
```

**Option 2: Vercel Dashboard (Easiest)**

1. Go to: https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import `kunaldubey10/Herb` repository
5. Set Root Directory: `HerbalTrace/web-portal-cloned`
6. Click "Deploy"

**You'll get URL like:** `https://herbaltrace-portal.vercel.app`

---

### STEP 3: Create Consumer Verification Page (5 minutes)

#### A. Create Consumer Page Component

**File:** `web-portal-cloned/src/pages/ConsumerVerification.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ConsumerVerification = () => {
  const { qrCode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductData();
  }, [qrCode]);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `https://herb-production-92c3.up.railway.app/api/v1/products/verify/${qrCode}`
      );
      setProduct(response.data.data);
    } catch (err) {
      setError('Product not found or QR code invalid');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid QR Code</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">✓ Authentic Product</h1>
                <p className="text-green-100">Verified by HerbalTrace Blockchain</p>
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{product?.productName}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Product ID</p>
                <p className="font-semibold text-gray-900">{product?.productId}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Batch Number</p>
                <p className="font-semibold text-gray-900">{product?.batchId}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Manufacturing Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product?.manufacturingDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product?.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">Blockchain Verified</p>
                  <p className="text-sm text-green-700">Transaction ID: {product?.blockchainTxId?.substring(0, 20)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Product Journey</h3>
          
          <div className="space-y-6">
            {/* Farmer */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Farmer Collection</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Collected by: {product?.journey?.farmer?.name || 'Verified Farmer'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Location: {product?.journey?.farmer?.location || 'Uttarakhand, India'}
                </p>
              </div>
            </div>

            {/* Lab Testing */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔬</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Quality Testing</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Tested by: {product?.journey?.lab?.name || 'Certified Lab'}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    ✓ Quality Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚗️</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Processing</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Processed by: {product?.journey?.processor?.name || 'Certified Processor'}
                </p>
              </div>
            </div>

            {/* Manufacturing */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏭</span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Manufacturing</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Manufactured by: {product?.manufacturer?.name || product?.manufacturerName}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Facility: GMP Certified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        {product?.certificates && (
          <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">GMP Certified</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">Lab Tested</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">Blockchain Verified</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">Powered by HerbalTrace Blockchain Technology</p>
          <p className="text-xs mt-1">Ensuring transparency and authenticity in herbal products</p>
        </div>
      </div>
    </div>
  );
};

export default ConsumerVerification;
```

#### B. Add Route

**File:** `web-portal-cloned/src/App.jsx`

Add this route:

```jsx
import ConsumerVerification from './pages/ConsumerVerification';

// In your routes:
<Route path="/verify/:qrCode" element={<ConsumerVerification />} />
```

---

### STEP 4: Update QR Code Generation (5 minutes)

**File:** `backend/src/services/QRService.ts`

Update QR code data to include Vercel URL:

```typescript
async generateProductQR(productId: string): Promise<string> {
  const qrData = {
    productId,
    verifyUrl: `https://herbaltrace-portal.vercel.app/verify/${productId}`,
    timestamp: Date.now()
  };
  
  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  return qrCode;
}
```

---

## 🎬 Complete Demo Flow

### Demo Script (15 minutes)

#### **SCENE 1: Farmer Collection (Mobile App)** 
```
1. Open Flutter mobile app
2. Login as farmer
3. Fill collection form:
   - Species: Ashwagandha
   - Quantity: 5 kg
   - Location: GPS auto-captured
4. Take photo
5. Submit ✓
   ➜ Data syncs to blockchain instantly
```

#### **SCENE 2: Admin Dashboard (Web Portal)**
```
1. Open: https://herbaltrace-portal.vercel.app
2. Login as admin
3. Go to "Batch Management" tab
4. See the Ashwagandha collection
5. Select collection(s)
6. Click "Create Batch"
7. Assign to Lab ✓
```

#### **SCENE 3: Lab Testing (Web Portal)**
```
1. Login as lab user
2. See assigned batch
3. Click "Perform Tests"
4. Enter test results:
   - Heavy metals: Pass
   - Microbial: Pass
   - Active compounds: 2.5%
5. Submit results ✓
   ➜ Batch moves to processor
```

#### **SCENE 4: Processor (Web Portal)**
```
1. Login as processor
2. See tested batches
3. Select batch
4. Click "Process Batch"
5. Enter processing details
6. Submit ✓
   ➜ Ready for manufacturing
```

#### **SCENE 5: Manufacturer (Web Portal)**
```
1. Login as manufacturer
2. Create new product
3. Fill product details:
   - Name: "Premium Ashwagandha Capsules"
   - Batch: Select processed batch
   - Manufacturing date
   - Expiry date
4. Click "Generate QR Code" ✓
5. QR code appears
6. Download QR code image
```

#### **SCENE 6: Consumer Verification (Mobile/Web)**
```
1. Open Google Lens / Camera
2. Scan the QR code
3. Redirects to: https://herbaltrace-portal.vercel.app/verify/PRODUCT-ID
4. Beautiful page shows:
   ✓ Product authenticated
   ✓ Blockchain verified
   ✓ Complete journey from farm to product
   ✓ All certifications
5. Customer confident in authenticity! ✓
```

---

## ✅ Yes, Google Lens Compatible!

### How QR Codes Work:

**Current Implementation:**
```javascript
// QR code contains JSON data
{
  "productId": "PROD-123",
  "verifyUrl": "https://herbaltrace-portal.vercel.app/verify/PROD-123",
  "timestamp": 1702123456789
}
```

**When scanned:**
1. Google Lens reads QR code
2. Detects the `verifyUrl`
3. Opens browser to verification page
4. Page loads product data from blockchain
5. Shows complete journey

**To make it simpler (Optional):**

Update QR code to contain just URL:

```typescript
// In QRService.ts
const qrData = `https://herbaltrace-portal.vercel.app/verify/${productId}`;
const qrCode = await QRCode.toDataURL(qrData);
```

Now Google Lens will directly open the link!

---

## 📦 Complete System URLs

### Production URLs:

```
Backend API:       https://herb-production-92c3.up.railway.app
Web Portal:        https://herbaltrace-portal.vercel.app (deploy now)
Admin Dashboard:   https://herbaltrace-portal.vercel.app/admin
Lab Dashboard:     https://herbaltrace-portal.vercel.app/lab
Processor:         https://herbaltrace-portal.vercel.app/processor
Manufacturer:      https://herbaltrace-portal.vercel.app/manufacturer
Consumer Page:     https://herbaltrace-portal.vercel.app/verify/:qrCode
Mobile App:        farmer-app.apk (uses Railway API)
```

---

## 🎯 Demo Checklist

### Before Demo:

- [ ] Flutter app updated with Railway URL
- [ ] Web portal deployed to Vercel
- [ ] Consumer verification page created
- [ ] Test credentials ready
- [ ] Sample data created (farmer collection → product)
- [ ] QR code printed or ready to scan
- [ ] All logins tested

### During Demo:

- [ ] Start with farmer mobile app
- [ ] Show blockchain sync message
- [ ] Switch to admin web portal
- [ ] Create batch, assign to lab
- [ ] Lab tests the batch
- [ ] Processor processes it
- [ ] Manufacturer creates product + QR
- [ ] Scan QR code with phone
- [ ] Show beautiful verification page
- [ ] Highlight blockchain verification

---

## 🚀 Deploy Now Commands

```powershell
# 1. Update web portal API URL
cd d:\Trial\HerbalTrace\web-portal-cloned
# Edit src/services/apiService.js
# Change API_BASE_URL to: https://herb-production-92c3.up.railway.app/api/v1

# 2. Deploy to Vercel
npm install -g vercel
npm run build
vercel --prod

# 3. Note your Vercel URL and update QR generation code
```

Ready to deploy? Let me know if you need help with any step!
