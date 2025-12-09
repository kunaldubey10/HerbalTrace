# 📱 Flutter Mobile App Integration - Complete Setup

## ✅ What's Been Done

### 1. Backend API Ready
- ✅ Backend server configured on port 3000
- ✅ All API endpoints working (auth, collections, upload)
- ✅ CORS enabled for mobile access
- ✅ Blockchain integration active

### 2. Network Configuration
- ✅ System IP identified: **172.28.192.1**
- ✅ Backend accessible at: **http://172.28.192.1:3000**
- ⚠️ Firewall rule needs Administrator privileges

### 3. Documentation Created
- ✅ Complete integration guide: `MOBILE_APP_INTEGRATION_GUIDE.md`
- ✅ Setup script: `setup-mobile.ps1`
- ✅ Quick test script: `quick-test-api.ps1`

---

## 📋 Next Steps to Connect Your Flutter App

### Step 1: Start Backend (if not running)
```powershell
cd d:\Trial\HerbalTrace\backend
npm start
```

Wait for this message:
```
✅ Connected to Fabric network
Server: http://localhost:3000
```

### Step 2: Configure Firewall (Run as Administrator)
```powershell
New-NetFirewallRule -DisplayName "HerbalTrace Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

Or run the setup script:
```powershell
# Right-click PowerShell → "Run as Administrator"
cd d:\Trial\HerbalTrace
.\setup-mobile.ps1
```

### Step 3: Update Flutter App Configuration

In your Flutter app, update the API base URL:

**File:** `lib/config/api_config.dart` (or wherever you store config)

```dart
class ApiConfig {
  static const String BASE_URL = 'http://172.28.192.1:3000/api/v1';
  
  // API Endpoints
  static const String LOGIN = '$BASE_URL/auth/login';
  static const String REGISTER = '$BASE_URL/auth/register';
  static const String COLLECTIONS = '$BASE_URL/collections';
  static const String UPLOAD_IMAGE = '$BASE_URL/upload/image';
}
```

### Step 4: Test Connection from Mobile Device

#### Option A: Test from Mobile Browser
1. Connect your mobile device to the same WiFi as this computer
2. Open browser on mobile
3. Navigate to: `http://172.28.192.1:3000`
4. You should see: `"name": "HerbalTrace Backend API"`

#### Option B: Test from Mobile App
Use these test credentials:
- **Username:** `farmer-1765221082597-p4a9`
- **Password:** `Farmer123`

### Step 5: Add Flutter Dependencies

Update `pubspec.yaml`:
```yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
  geolocator: ^10.1.0
  permission_handler: ^11.0.1
  image_picker: ^1.0.4
```

Run:
```bash
flutter pub get
```

### Step 6: Implement API Service

See complete code in: `MOBILE_APP_INTEGRATION_GUIDE.md`

Quick example:
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String BASE_URL = 'http://172.28.192.1:3000/api/v1';
  
  Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$BASE_URL/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Login failed');
    }
  }
  
  Future<Map<String, dynamic>> submitCollection({
    required String species,
    required double quantity,
    required double latitude,
    required double longitude,
    String? notes,
  }) async {
    // Get token from storage
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    final response = await http.post(
      Uri.parse('$BASE_URL/collections'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'species': species,
        'quantity': quantity,
        'unit': 'kg',
        'harvestDate': DateTime.now().toIso8601String().split('T')[0],
        'latitude': latitude,
        'longitude': longitude,
        'altitude': 0,
        'notes': notes ?? '',
      }),
    );
    
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to submit collection');
    }
  }
}
```

---

## 🏗️ Architecture

```
┌─────────────────────┐
│  Flutter Mobile App │
│  (Different Device) │
└──────────┬──────────┘
           │
           │ HTTP/REST API
           │ (172.28.192.1:3000)
           │
           ▼
┌─────────────────────┐
│   Backend Server    │
│   (Node.js/Express) │
└──────────┬──────────┘
           │
           │ Fabric SDK
           │
           ▼
┌─────────────────────┐
│ Blockchain Network  │
│ (Hyperledger Fabric)│
└─────────────────────┘
```

**Key Points:**
- ✅ Mobile app makes HTTP requests to backend
- ✅ Backend handles ALL blockchain interactions
- ✅ Collections submitted from mobile automatically sync to blockchain
- ✅ No direct blockchain connection from mobile needed

---

## 🔐 Authentication Flow

```
1. User enters credentials in mobile app
   ↓
2. App sends POST to /api/v1/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend returns JWT token + user info
   ↓
5. App stores token in SharedPreferences
   ↓
6. App includes token in all future requests:
   Authorization: Bearer <token>
```

---

## 📦 Collection Submission Flow

```
1. Farmer fills collection form in mobile app
   ↓
2. App gets GPS location
   ↓
3. App sends POST to /api/v1/collections with:
   - species, quantity, harvestDate
   - latitude, longitude, altitude
   - notes, token
   ↓
4. Backend validates data
   ↓
5. Backend saves to SQLite database
   ↓
6. Backend submits to blockchain (automatic)
   ↓
7. Backend returns success with blockchain_tx_id
   ↓
8. Collection appears in admin dashboard
```

---

## 🌐 API Endpoints Reference

### Base URL
```
http://172.28.192.1:3000/api/v1
```

### Authentication
```
POST /auth/login
POST /auth/register
GET  /auth/profile (requires token)
```

### Collections
```
POST /collections (submit new collection)
GET  /collections (get farmer's collections)
GET  /collections/:id (get specific collection)
```

### Upload
```
POST /upload/image (upload collection photos)
```

### Batches (admin only)
```
GET  /batches
POST /batches (create batch from collections)
```

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Backend running: `npm start` in `d:\Trial\HerbalTrace\backend`
- [ ] API accessible: Visit `http://172.28.192.1:3000` in browser
- [ ] Blockchain connected: Check startup logs for "✅ Blockchain connected"

### Network Tests
- [ ] Firewall rule created (requires Admin)
- [ ] Mobile device on same WiFi network
- [ ] Mobile browser can access `http://172.28.192.1:3000`

### Mobile App Tests
- [ ] Dependencies installed: `flutter pub get`
- [ ] API config updated with `172.28.192.1:3000`
- [ ] Android permissions configured (Internet, Location, Camera)
- [ ] Login works with test credentials
- [ ] Collection submission works
- [ ] Collection appears in admin dashboard

### Blockchain Tests
- [ ] Collection has `blockchain_tx_id` field
- [ ] Collection `sync_status` is "synced"
- [ ] Admin can create batch from collection
- [ ] Batch appears in lab dashboard

---

## 🚨 Troubleshooting

### Issue: "Unable to connect to server"

**Solution 1:** Check backend is running
```powershell
cd d:\Trial\HerbalTrace\backend
npm start
```

**Solution 2:** Check firewall
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "HerbalTrace Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

**Solution 3:** Verify same WiFi network
- This computer and mobile device must be on the same WiFi
- Corporate networks may block device-to-device communication

### Issue: "Connection refused" or "Network error"

**Check IP address:**
```powershell
ipconfig
# Look for "IPv4 Address" in your WiFi adapter
# Should be 172.28.192.1
```

**Test from this computer:**
```powershell
.\quick-test-api.ps1
```

### Issue: "401 Unauthorized"

**Cause:** Token expired or invalid

**Solution:** Re-login to get new token

### Issue: Different WiFi Networks

**Use ngrok for external access:**

1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update Flutter app: `BASE_URL = 'https://abc123.ngrok.io/api/v1'`

---

## 📚 Complete Reference Documents

### Main Documentation
- **Integration Guide:** `MOBILE_APP_INTEGRATION_GUIDE.md` (400+ lines)
  - Complete architecture
  - Flutter code examples
  - Android permissions
  - API documentation
  - Security best practices

### Scripts
- **Setup Script:** `setup-mobile.ps1`
  - Detects IP address
  - Creates firewall rule
  - Tests backend
  - Shows configuration

- **Quick Test:** `quick-test-api.ps1`
  - Tests API connection
  - Shows configuration
  - Displays test credentials

---

## 🎯 Quick Start Commands

### Start Backend
```powershell
cd d:\Trial\HerbalTrace\backend
npm start
```

### Test API
```powershell
cd d:\Trial\HerbalTrace
.\quick-test-api.ps1
```

### Configure Firewall (Admin)
```powershell
cd d:\Trial\HerbalTrace
.\setup-mobile.ps1
```

### Check Blockchain Status
```powershell
cd d:\Trial\HerbalTrace
.\check-status.ps1
```

---

## 📞 Support

If you encounter issues:

1. Check backend logs for errors
2. Verify firewall allows port 3000
3. Confirm mobile and PC on same WiFi
4. Test API from mobile browser first
5. Review `MOBILE_APP_INTEGRATION_GUIDE.md` for detailed troubleshooting

---

## ✅ Success Indicators

You know it's working when:

- ✅ Mobile app can login successfully
- ✅ GPS location is captured
- ✅ Collection submission returns success
- ✅ Collection appears in admin dashboard → Batch Management tab
- ✅ Collection has `blockchain_tx_id` field
- ✅ Collection `sync_status` is "synced"
- ✅ Admin can create batch from the collection
- ✅ Batch appears in lab dashboard

---

**Created:** December 9, 2025  
**System IP:** 172.28.192.1  
**Backend Port:** 3000  
**Blockchain:** Hyperledger Fabric 2.5.14  
**Status:** ✅ Ready for Integration
