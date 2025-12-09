# 🚀 DEPLOYMENT CHECKLIST - Final Steps

## ✅ Completed

1. **Web Portal API Configuration**
   - ✅ Updated `apiService.js` to use Railway URL: `https://herb-production-92c3.up.railway.app/api/v1`
   
2. **Consumer Verification Page**
   - ✅ Created `ConsumerVerification.jsx` in `web-portal-cloned/src/pages/`
   - ✅ Added route in `App.jsx`: `/verify/:qrCode`
   - ✅ Imported component in App.jsx

3. **Backend Deployment**
   - ✅ Deployed to Railway: `https://herb-production-92c3.up.railway.app`

## 📋 Next Steps (5-10 minutes)

### Step 1: Deploy Web Portal to Vercel (5 minutes)

**Option A: Using Vercel CLI (Recommended)**
```powershell
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to web portal
cd d:\Trial\HerbalTrace\web-portal-cloned

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import Git Repository: `kunaldubey10/Herb`
3. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `HerbalTrace/web-portal-cloned`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"

**Expected Result**: You'll get a URL like:
```
https://herbaltrace-portal.vercel.app
```

### Step 2: Update Flutter App (10 minutes)

1. **Find API Configuration File**
   - Location: Usually `lib/services/api_service.dart` or `lib/config/api_config.dart`
   
2. **Update Base URL**
   ```dart
   class ApiConfig {
     static const String BASE_URL = 'https://herb-production-92c3.up.railway.app/api/v1';
   }
   ```

3. **Rebuild APK**
   ```bash
   # In Flutter project directory
   flutter clean
   flutter pub get
   flutter build apk --release
   ```

4. **Install APK**
   - APK location: `build/app/outputs/flutter-apk/app-release.apk`
   - Transfer to mobile device
   - Install and test

### Step 3: Update QR Code Generation (Optional - 5 minutes)

**Current QR Data Format**:
```json
{
  "productId": "PROD-123",
  "verifyUrl": "https://herbaltrace-portal.vercel.app/verify/PROD-123"
}
```

**Recommended for Google Lens** (Plain URL):
```typescript
// In backend/src/services/QRService.ts
const qrData = `https://herbaltrace-portal.vercel.app/verify/${productId}`;
```

**After updating**:
```powershell
cd d:\Trial\HerbalTrace
git add .
git commit -m "Update QR code generation for direct URL"
git push origin clean-main
```

Railway will auto-deploy the changes.

## 🎯 Complete Demo Flow

### Scene 1: Farmer Collection (Mobile App)
- Open Flutter app on mobile
- Login as Farmer (ID: FARMER001, Password: Test@123)
- Submit new collection:
  - Herb Type: Ashwagandha
  - Quantity: 5 kg
  - Location: Karnataka
- Take screenshot

### Scene 2: Admin Batch Creation (Web Portal)
- Open: `https://herbaltrace-portal.vercel.app/admin`
- Login as Admin
- Go to "Collections" tab
- Select the farmer's collection
- Create batch (Batch ID will be auto-generated)
- Take screenshot

### Scene 3: Lab Testing (Web Portal)
- Open: `https://herbaltrace-portal.vercel.app/laboratory`
- Login as Lab Technician
- Find the batch in "Pending Tests"
- Enter test results:
  - Quality Grade: A
  - Purity: 95%
  - Heavy Metals: Pass
- Submit test report
- Take screenshot

### Scene 4: Processor Processing (Web Portal)
- Open: `https://herbaltrace-portal.vercel.app/processor`
- Login as Processor
- Find tested batch in "Ready for Processing"
- Enter processing details:
  - Processing Method: Steam extraction
  - Yield: 85%
  - Final Weight: 4.25 kg
- Complete processing
- Take screenshot

### Scene 5: Manufacturer Product Creation (Web Portal)
- Open: `https://herbaltrace-portal.vercel.app/manufacturer`
- Login as Manufacturer
- Select processed batch
- Create product:
  - Product Name: Ashwagandha Root Powder 100g
  - Batch ID: (auto-filled)
  - Manufacturing Date: Today
  - Expiry Date: 2 years from today
  - Packaging: Sealed pouch
- Generate QR code
- Download/Print QR code
- Take screenshot

### Scene 6: Consumer Verification (Google Lens)
1. Open Google Lens on mobile
2. Scan the printed QR code
3. QR code opens verification page automatically
4. Shows beautiful verification page with:
   - ✓ Blockchain Verified badge
   - Product details
   - Complete journey timeline
   - All certificates
5. Take screenshot

## 📱 URLs Summary

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | `https://herb-production-92c3.up.railway.app` | All API endpoints |
| Web Portal | `https://herbaltrace-portal.vercel.app` | Admin/Lab/Processor/Manufacturer dashboards |
| Consumer Page | `https://herbaltrace-portal.vercel.app/verify/:qrCode` | QR code verification |
| Mobile App | Local APK | Farmer collections |

## 🧪 Testing Commands

```powershell
# Test backend health
curl https://herb-production-92c3.up.railway.app/

# Test web portal (after Vercel deployment)
curl https://herbaltrace-portal.vercel.app/

# Test consumer verification page
curl https://herbaltrace-portal.vercel.app/verify/PROD-123
```

## 🎬 Demo Tips

1. **Prepare Sample Data** (15 minutes before demo):
   - Create 1 farmer collection
   - Process it through all stages
   - Generate QR code
   - Print/display QR code

2. **Demo Duration**: 15 minutes
   - 2 min: Intro + System overview
   - 2 min: Farmer mobile app
   - 3 min: Admin + Lab workflow
   - 2 min: Processor workflow
   - 3 min: Manufacturer + QR generation
   - 3 min: Consumer verification (highlight)

3. **Highlight Points**:
   - ✨ Blockchain verification badge
   - 🔍 Complete transparency (farmer to consumer)
   - 📱 Google Lens compatible
   - 🌐 Cloud-based (accessible anywhere)
   - 🔐 Secure and immutable records

## 📸 Screenshot Checklist

Prepare these screenshots for presentation:
- [ ] Flutter app - Farmer dashboard
- [ ] Flutter app - Collection submission form
- [ ] Web portal - Admin batch creation
- [ ] Web portal - Lab test results
- [ ] Web portal - Processor processing details
- [ ] Web portal - Manufacturer product creation
- [ ] Web portal - QR code generation
- [ ] Mobile - Google Lens scanning QR
- [ ] Mobile - Consumer verification page (full journey)

## 🚨 Troubleshooting

### Web Portal Not Loading
```powershell
cd d:\Trial\HerbalTrace\web-portal-cloned
npm install
npm run dev
# Check for errors in console
```

### Railway Backend Not Responding
- Check Railway logs: https://railway.app (Go to project → Deployments)
- Verify environment variables
- Check if service is running

### Flutter App Connection Issues
- Verify API URL is correct (Railway URL)
- Check device internet connection
- Test backend URL in browser first

### QR Code Not Opening
- Ensure QR contains plain URL (not JSON)
- Test QR with any QR scanner app first
- Verify Vercel deployment is live

## 🎉 Success Criteria

✅ Web portal deployed to Vercel  
✅ Flutter app connects to Railway backend  
✅ Can create collection from mobile app  
✅ Can process batch through all stages on web  
✅ Can generate QR code with product  
✅ QR code opens verification page via Google Lens  
✅ Verification page shows complete journey  
✅ All data flows correctly through system  

---

**Total Setup Time**: ~20 minutes  
**Demo Duration**: 15 minutes  
**Confidence Level**: 🚀 Ready to impress!
