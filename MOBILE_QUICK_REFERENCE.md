# 📱 Mobile App Integration - Quick Reference Card

## ✅ BACKEND IS READY!
- **API URL:** `http://172.28.192.1:3000`
- **API Version:** 1.0.0
- **Blockchain:** Connected ✅
- **Status:** ONLINE ✅

---

## 🚀 3-STEP FLUTTER SETUP

### Step 1: Update API Config in Your Flutter App
```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String BASE_URL = 'http://172.28.192.1:3000/api/v1';
}
```

### Step 2: Add Dependencies (if not already added)
```yaml
# pubspec.yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
  geolocator: ^10.1.0
  permission_handler: ^11.0.1
```

Run: `flutter pub get`

### Step 3: Test Login
Use these credentials to test:
- **Username:** `farmer-1765221082597-p4a9`
- **Password:** `Farmer123`

---

## 📡 API Endpoints

### Authentication
```
POST http://172.28.192.1:3000/api/v1/auth/login
POST http://172.28.192.1:3000/api/v1/auth/register
GET  http://172.28.192.1:3000/api/v1/auth/profile
```

### Collections (Farmer)
```
POST http://172.28.192.1:3000/api/v1/collections
GET  http://172.28.192.1:3000/api/v1/collections
GET  http://172.28.192.1:3000/api/v1/collections/:id
```

### Upload
```
POST http://172.28.192.1:3000/api/v1/upload/image
```

---

## 📱 Example: Submit Collection

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> submitCollection() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('auth_token');
  
  final response = await http.post(
    Uri.parse('http://172.28.192.1:3000/api/v1/collections'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'species': 'Ashwagandha',
      'quantity': 2.5,
      'unit': 'kg',
      'harvestDate': '2025-12-09',
      'latitude': 30.3165,
      'longitude': 78.0322,
      'altitude': 640,
      'notes': 'From mobile app',
    }),
  );
  
  if (response.statusCode == 201) {
    final result = jsonDecode(response.body);
    print('Success! Blockchain TX: ${result['data']['blockchain_tx_id']}');
  }
}
```

---

## 🔐 Example: Login

```dart
Future<String?> login(String username, String password) async {
  final response = await http.post(
    Uri.parse('http://172.28.192.1:3000/api/v1/auth/login'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'username': username,
      'password': password,
    }),
  );
  
  if (response.statusCode == 200) {
    final result = jsonDecode(response.body);
    final token = result['data']['token'];
    
    // Save token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    
    return token;
  }
  
  return null;
}
```

---

## 🌐 Network Requirements

### ✅ Both devices MUST be on the SAME WiFi network

**Check from mobile device:**
1. Open browser on mobile
2. Visit: `http://172.28.192.1:3000`
3. Should see: `{"name":"HerbalTrace API"}`

### ⚠️ If on different networks, use ngrok:
```bash
ngrok http 3000
# Use the https URL in your Flutter app
```

---

## 🔒 Android Permissions

Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
```

---

## 🧪 Testing Checklist

### Backend (This Computer)
- [✅] Backend running: `npm start` in `backend/` folder
- [✅] API online: Visit `http://172.28.192.1:3000`
- [✅] Blockchain connected: Check terminal logs

### Network (Required)
- [ ] Mobile device on same WiFi as this computer
- [ ] Firewall allows port 3000 (run `setup-mobile.ps1` as Admin)
- [ ] Mobile browser can access `http://172.28.192.1:3000`

### Flutter App
- [ ] Dependencies installed: `flutter pub get`
- [ ] API config updated: BASE_URL = `http://172.28.192.1:3000/api/v1`
- [ ] Android permissions configured
- [ ] Login test successful
- [ ] Collection submission successful

---

## 🚨 Quick Troubleshooting

### "Can't connect to server"
✅ Check backend is running: `npm start`
✅ Check same WiFi network
✅ Test in mobile browser first

### "401 Unauthorized"
✅ Re-login to get new token
✅ Check token is being sent in headers

### "Network error" or "Timeout"
✅ Run firewall setup as Admin: `.\setup-mobile.ps1`
✅ Try ngrok if on different networks

---

## 📚 Complete Documentation

### Main Guides
- **Complete Guide:** `MOBILE_APP_INTEGRATION_GUIDE.md`
- **Summary:** `FLUTTER_MOBILE_INTEGRATION_SUMMARY.md`

### Scripts
- **Setup:** `setup-mobile.ps1` (configure firewall)
- **Test:** `quick-test-api.ps1` (check API status)

---

## 💡 Key Concepts

### Architecture
```
Flutter App → HTTP API → Backend → Blockchain
```

### Data Flow
```
1. Mobile submits collection
2. Backend saves to database
3. Backend syncs to blockchain (automatic)
4. Admin sees collection in dashboard
5. Admin creates batch
6. Lab sees batch for testing
```

### Authentication
```
1. Login → Get JWT token
2. Store token in SharedPreferences
3. Send token in all requests
4. Token format: Bearer <token>
```

---

## 📞 Need Help?

1. Check backend logs for errors
2. Test API from mobile browser
3. Review complete guide: `MOBILE_APP_INTEGRATION_GUIDE.md`
4. Check firewall settings

---

## ✅ SUCCESS INDICATORS

You know it's working when:
- ✅ Mobile app login succeeds
- ✅ Collection submission returns `blockchain_tx_id`
- ✅ Collection appears in admin dashboard
- ✅ Collection `sync_status` is "synced"

---

**System IP:** 172.28.192.1  
**Backend Port:** 3000  
**Status:** ✅ READY  
**Last Tested:** December 9, 2025
