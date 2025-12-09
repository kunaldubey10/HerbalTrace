# 🚀 WEB PORTAL DEPLOYMENT GUIDE

## 📝 Changes Made (Not in Git due to .gitignore)

The following files were modified locally but are not committed to Git because `web-portal-cloned/` is in `.gitignore`:

### 1. API Configuration Updated
**File**: `web-portal-cloned/src/services/apiService.js`

**Change**:
```javascript
// OLD:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// NEW:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://herb-production-92c3.up.railway.app/api/v1';
```

### 2. Consumer Verification Page Created
**File**: `web-portal-cloned/src/pages/ConsumerVerification.jsx`

**Status**: ✅ Complete React component (450+ lines)

**Features**:
- Fetches product data from Railway API
- Beautiful gradient UI
- Blockchain verification badge
- Complete journey timeline
- Mobile responsive
- Loading and error states

### 3. App.jsx Route Added
**File**: `web-portal-cloned/src/App.jsx`

**Changes**:
```jsx
// Import added:
import ConsumerVerification from './pages/ConsumerVerification'

// Route added:
<Route path="/verify/:qrCode" element={<ConsumerVerification />} />
```

## 🚀 Deployment Steps

### Option 1: Deploy from Local Folder (Recommended)

Since changes are local and not in Git, deploy directly from your local folder:

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to web portal
cd d:\Trial\HerbalTrace\web-portal-cloned

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod
```

**Follow the prompts**:
- Set up and deploy: `Y`
- Which scope: Choose your account
- Link to existing project: `N`
- Project name: `herbaltrace-portal`
- Directory: `./` (current directory)
- Override settings: `N`

**Deployment takes ~2 minutes**. You'll get:
```
✅ Production: https://herbaltrace-portal.vercel.app
```

### Option 2: Create Separate Git Repository (Alternative)

If you want the web portal in Git:

```powershell
# Remove from .gitignore
cd d:\Trial\HerbalTrace
# Edit .gitignore and remove the line: web-portal-cloned/

# Commit to your repo
git add web-portal-cloned
git commit -m "Add web portal with Railway integration"
git push origin clean-main

# Then deploy via Vercel Dashboard
# 1. Go to https://vercel.com/new
# 2. Import kunaldubey10/Herb
# 3. Root Directory: HerbalTrace/web-portal-cloned
# 4. Deploy
```

### Option 3: Use Local Build + Manual Upload

```powershell
cd d:\Trial\HerbalTrace\web-portal-cloned
npm run build

# Upload the 'dist' folder to any static hosting:
# - Vercel (drag & drop)
# - Netlify (drag & drop)
# - GitHub Pages
# - Firebase Hosting
```

## ✅ Verification After Deployment

Once deployed, test these URLs:

1. **Home Page**:
   ```
   https://herbaltrace-portal.vercel.app/
   ```

2. **Admin Dashboard**:
   ```
   https://herbaltrace-portal.vercel.app/admin
   ```

3. **Consumer Verification** (test with any product ID):
   ```
   https://herbaltrace-portal.vercel.app/verify/PROD-123
   ```

4. **API Connection Test**:
   - Login to any dashboard
   - If data loads → ✅ Railway backend connected
   - If error → Check browser console for CORS issues

## 🔧 Troubleshooting

### Issue: CORS Error
**Solution**: Add Vercel URL to Railway backend CORS configuration

In Railway dashboard, add environment variable:
```
CORS_ORIGINS=https://herbaltrace-portal.vercel.app
```

### Issue: Build Fails
**Solution**: Check Node.js version

```powershell
cd d:\Trial\HerbalTrace\web-portal-cloned
node --version  # Should be 16.x or higher
npm install
npm run build
```

### Issue: Consumer Verification Page 404
**Solution**: Vercel needs to handle client-side routing

Create `web-portal-cloned/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Then redeploy.

## 📋 Quick Deployment Checklist

- [ ] Verify API URL in `apiService.js` points to Railway
- [ ] `ConsumerVerification.jsx` exists in `src/pages/`
- [ ] Route added in `App.jsx`
- [ ] Run `npm install` (if dependencies changed)
- [ ] Run `npm run build` (test local build)
- [ ] Deploy to Vercel with `vercel --prod`
- [ ] Test home page loads
- [ ] Test admin login works
- [ ] Test `/verify/PROD-123` shows consumer page
- [ ] Test API calls work (check Network tab)

## 🎉 Expected Result

After successful deployment:

```
✅ Web Portal: https://herbaltrace-portal.vercel.app
✅ Admin Dashboard: /admin
✅ Lab Dashboard: /laboratory
✅ Processor Dashboard: /processor
✅ Manufacturer Dashboard: /manufacturer
✅ Consumer Verification: /verify/:qrCode
✅ Backend API: https://herb-production-92c3.up.railway.app
```

**Total Deployment Time**: ~5 minutes

---

**Next**: Update QR code generation to use your Vercel URL, then test complete flow!
