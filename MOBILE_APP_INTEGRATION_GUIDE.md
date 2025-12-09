# Mobile App Integration Guide - HerbalTrace

## Overview
This guide explains how to integrate your Flutter mobile app with the HerbalTrace blockchain network.

## Architecture

```
┌─────────────────┐      HTTPS/REST API       ┌──────────────────┐      Fabric SDK      ┌─────────────────┐
│  Flutter App    │ ────────────────────────> │  Backend Server  │ ──────────────────> │   Blockchain    │
│  (Mobile/APK)   │ <──────────────────────── │  (Express/Node)  │ <─────────────────── │   Network       │
└─────────────────┘                           └──────────────────┘                      └─────────────────┘
   Different WiFi/                               Your System                               Hyperledger
   Mobile Network                                localhost:3000                            Fabric
```

---

## Step 1: Make Backend Accessible from Mobile

### Option A: Local Network (Recommended for Testing)

**1. Find Your Computer's IP Address:**
```powershell
# On Windows PowerShell
ipconfig | findstr IPv4
# Look for: IPv4 Address. . . . . . . . . . . : 192.168.x.x
```

**2. Update Backend to Listen on All Interfaces:**

The backend is already configured to listen on `0.0.0.0`, which means it accepts connections from any IP.

**3. Configure Mobile App API Base URL:**
```dart
// In your Flutter app (lib/config/api_config.dart)
class ApiConfig {
  // Replace with your computer's IP address
  static const String BASE_URL = 'http://192.168.1.100:3000/api/v1';
  
  // Alternative: Use ngrok for external access
  // static const String BASE_URL = 'https://your-ngrok-url.ngrok.io/api/v1';
}
```

**4. Allow Backend Through Firewall:**
```powershell
# Open PowerShell as Administrator
New-NetFirewallRule -DisplayName "HerbalTrace Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Option B: Using ngrok (For External Access)

**1. Install ngrok:**
```powershell
# Download from https://ngrok.com/download
# Or use chocolatey:
choco install ngrok
```

**2. Start ngrok tunnel:**
```powershell
ngrok http 3000
```

**3. Copy the HTTPS URL and use it in your Flutter app:**
```dart
static const String BASE_URL = 'https://abc123.ngrok.io/api/v1';
```

---

## Step 2: Backend API Endpoints for Mobile

### Authentication APIs

#### 1. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "farmer123",
  "password": "Farmer123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "farmer-1234567890",
      "username": "farmer123",
      "role": "Farmer",
      "fullName": "Ram Kumar",
      "email": "ram@example.com"
    }
  }
}
```

#### 2. Register (Submit Registration Request)
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Ram Kumar",
  "email": "ram@example.com",
  "phone": "9876543210",
  "role": "farmer",
  "organizationName": "Ram's Farm",
  "address": "Village Dehradun",
  "state": "Uttarakhand",
  "district": "Dehradun",
  "pincode": "248001"
}

Response:
{
  "success": true,
  "message": "Registration request submitted successfully. Admin will review and approve."
}
```

### Collection APIs (Farmer)

#### 3. Submit Collection
```http
POST /api/v1/collections
Authorization: Bearer <token>
Content-Type: application/json

{
  "species": "Ashwagandha",
  "quantity": 5.5,
  "unit": "kg",
  "harvestDate": "2025-12-09",
  "latitude": 30.3165,
  "longitude": 78.0322,
  "altitude": 640,
  "images": ["base64_image_string_1", "base64_image_string_2"],
  "notes": "High quality harvest from organic farm"
}

Response:
{
  "success": true,
  "message": "Collection recorded successfully and synced to blockchain",
  "data": {
    "id": "COL-1765253056715-46f98b8a",
    "species": "Ashwagandha",
    "quantity": 5.5,
    "blockchain_tx_id": "67f6e77109b9718ac454c6da7690fe4ba43625e8...",
    "sync_status": "synced"
  }
}
```

#### 4. Get My Collections
```http
GET /api/v1/collections
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "COL-1765253056715-46f98b8a",
      "species": "Ashwagandha",
      "quantity": 5.5,
      "unit": "kg",
      "harvest_date": "2025-12-09",
      "sync_status": "synced",
      "blockchain_tx_id": "67f6e77109...",
      "created_at": "2025-12-09 04:04:16"
    }
  ]
}
```

#### 5. Get Collection by ID
```http
GET /api/v1/collections/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "COL-1765253056715-46f98b8a",
    "farmer_id": "farmer-1765221082597-p4a9",
    "farmer_name": "Shreya",
    "species": "Ashwagandha",
    "quantity": 5.5,
    "unit": "kg",
    "latitude": 30.3165,
    "longitude": 78.0322,
    "altitude": 640,
    "harvest_date": "2025-12-09",
    "sync_status": "synced",
    "blockchain_tx_id": "67f6e77109...",
    "created_at": "2025-12-09 04:04:16"
  }
}
```

### Image Upload API

#### 6. Upload Image
```http
POST /api/v1/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- image: <file> (or base64 string)

Response:
{
  "success": true,
  "data": {
    "filename": "IMG-1765253056715.jpg",
    "path": "/uploads/IMG-1765253056715.jpg",
    "url": "http://192.168.1.100:3000/uploads/IMG-1765253056715.jpg"
  }
}
```

---

## Step 3: Flutter Implementation

### 1. API Service Class

```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String BASE_URL = 'http://192.168.1.100:3000/api/v1';
  
  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
  
  // Save token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }
  
  // Login
  Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$BASE_URL/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'username': username,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success']) {
        await saveToken(data['data']['token']);
      }
      return data;
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }
  
  // Submit Collection
  Future<Map<String, dynamic>> submitCollection({
    required String species,
    required double quantity,
    required String harvestDate,
    required double latitude,
    required double longitude,
    double? altitude,
    List<String>? images,
    String? notes,
  }) async {
    final token = await getToken();
    
    final response = await http.post(
      Uri.parse('$BASE_URL/collections'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'species': species,
        'quantity': quantity,
        'unit': 'kg',
        'harvestDate': harvestDate,
        'latitude': latitude,
        'longitude': longitude,
        'altitude': altitude,
        'images': images,
        'notes': notes,
      }),
    );
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to submit collection: ${response.body}');
    }
  }
  
  // Get My Collections
  Future<List<dynamic>> getMyCollections() async {
    final token = await getToken();
    
    final response = await http.get(
      Uri.parse('$BASE_URL/collections'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'] ?? [];
    } else {
      throw Exception('Failed to load collections');
    }
  }
}
```

### 2. Location Service

```dart
// lib/services/location_service.dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  Future<Position> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}
```

### 3. Collection Submission Screen

```dart
// lib/screens/submit_collection_screen.dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class SubmitCollectionScreen extends StatefulWidget {
  @override
  _SubmitCollectionScreenState createState() => _SubmitCollectionScreenState();
}

class _SubmitCollectionScreenState extends State<SubmitCollectionScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  final LocationService _locationService = LocationService();
  
  String _species = 'Ashwagandha';
  double _quantity = 0.0;
  DateTime _harvestDate = DateTime.now();
  String? _notes;
  bool _isLoading = false;
  
  final List<String> _speciesList = [
    'Ashwagandha',
    'Tulsi (Holy Basil)',
    'Giloy',
    'Brahmi',
    'Shatavari',
    'Mulethi',
  ];
  
  Future<void> _submitCollection() async {
    if (!_formKey.currentState!.validate()) return;
    
    _formKey.currentState!.save();
    
    setState(() => _isLoading = true);
    
    try {
      // Get current location
      final position = await _locationService.getCurrentLocation();
      
      // Submit to backend (which syncs to blockchain)
      final result = await _apiService.submitCollection(
        species: _species,
        quantity: _quantity,
        harvestDate: _harvestDate.toIso8601String().split('T')[0],
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        notes: _notes,
      );
      
      if (result['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Collection synced to blockchain!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Submit Collection'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            // Species dropdown
            DropdownButtonFormField<String>(
              value: _species,
              decoration: InputDecoration(labelText: 'Species'),
              items: _speciesList.map((species) {
                return DropdownMenuItem(
                  value: species,
                  child: Text(species),
                );
              }).toList(),
              onChanged: (value) {
                setState(() => _species = value!);
              },
              validator: (value) {
                if (value == null) return 'Please select a species';
                return null;
              },
            ),
            
            SizedBox(height: 16),
            
            // Quantity field
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Quantity (kg)',
                suffixText: 'kg',
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter quantity';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid number';
                }
                return null;
              },
              onSaved: (value) {
                _quantity = double.parse(value!);
              },
            ),
            
            SizedBox(height: 16),
            
            // Harvest date picker
            ListTile(
              title: Text('Harvest Date'),
              subtitle: Text(_harvestDate.toLocal().toString().split(' ')[0]),
              trailing: Icon(Icons.calendar_today),
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  initialDate: _harvestDate,
                  firstDate: DateTime(2020),
                  lastDate: DateTime.now(),
                );
                if (picked != null) {
                  setState(() => _harvestDate = picked);
                }
              },
            ),
            
            SizedBox(height: 16),
            
            // Notes field
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Notes (optional)',
                alignLabelWithHint: true,
              ),
              maxLines: 3,
              onSaved: (value) {
                _notes = value;
              },
            ),
            
            SizedBox(height: 24),
            
            // Submit button
            ElevatedButton(
              onPressed: _isLoading ? null : _submitCollection,
              child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Submit to Blockchain'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## Step 4: Backend Setup

### 1. Verify Backend is Running
```powershell
cd D:\Trial\HerbalTrace\backend
npm start
```

### 2. Test Backend Connectivity from Mobile

**Using browser on mobile device:**
```
http://192.168.1.100:3000/
```

You should see the API welcome page.

### 3. Test API Endpoints

```powershell
# Test login from PowerShell
$body = @{
    username = "farmer123"
    password = "Farmer123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
$response
```

---

## Step 5: Flutter App Configuration

### Update pubspec.yaml
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.2.2
  geolocator: ^10.1.0
  permission_handler: ^11.0.1
```

### Update Android Permissions (android/app/src/main/AndroidManifest.xml)
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Internet permission -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Location permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <!-- Camera for photo capture -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <application
        android:usesCleartextTraffic="true"
        ...>
        ...
    </application>
</manifest>
```

---

## Step 6: Testing the Integration

### Test Checklist

- [ ] Backend is running on port 3000
- [ ] Firewall allows port 3000
- [ ] Mobile device is on same WiFi network
- [ ] Can access http://YOUR_IP:3000 from mobile browser
- [ ] Flutter app has correct BASE_URL configured
- [ ] Login works from mobile app
- [ ] Submit collection works and returns blockchain TX ID
- [ ] Collections list shows submitted data

### Troubleshooting

**Problem: Cannot connect from mobile**
```powershell
# Check if backend is listening
netstat -an | findstr :3000

# Check firewall rules
Get-NetFirewallRule -DisplayName "HerbalTrace Backend"

# Test from another device on same network
curl http://192.168.1.100:3000
```

**Problem: CORS errors**
- Backend already has CORS enabled for all origins
- If issues persist, check browser console for specific error

**Problem: Authentication fails**
```powershell
# Verify user exists
cd D:\Trial\HerbalTrace\backend
node show-users.js
```

---

## Step 7: Production Deployment (Optional)

For production deployment, consider:

1. **Cloud Hosting**: Deploy backend to AWS/Azure/GCP
2. **HTTPS**: Use SSL certificates (Let's Encrypt)
3. **Domain**: Get a proper domain name
4. **Load Balancer**: Handle multiple mobile clients
5. **API Gateway**: Rate limiting and security

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Collection recorded successfully",
  "data": {
    "id": "COL-1765253056715-46f98b8a",
    "blockchain_tx_id": "67f6e77109b9718ac454c6da7690fe4ba43625e8..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

---

## Security Best Practices

1. **Always use HTTPS in production** (not HTTP)
2. **Store tokens securely** (use Flutter Secure Storage)
3. **Implement token refresh** mechanism
4. **Validate all inputs** on both client and server
5. **Rate limit API calls** to prevent abuse
6. **Log all blockchain transactions** for audit trail

---

## Next Steps

1. Update your Flutter app's API base URL
2. Test login from mobile app
3. Test collection submission
4. Verify data appears in blockchain
5. Check admin dashboard shows the new data

---

## Support

If you encounter issues:
1. Check backend logs: `D:\Trial\HerbalTrace\backend\logs\`
2. Check blockchain network: `docker ps`
3. Verify API endpoints: Use Postman or curl
4. Check mobile app logs: `flutter logs`

