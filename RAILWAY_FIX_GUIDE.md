# 🔧 Railway Deployment Fix - CRITICAL STEPS

## ❌ Error You're Seeing

```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

**Cause:** Railway is looking at the wrong directory (root instead of backend)

---

## ✅ SOLUTION: Configure Root Directory in Railway Dashboard

### Step 1: Go to Your Railway Project
1. Open Railway dashboard: https://railway.app
2. Click on your **HerbalTrace** service

### Step 2: Set Root Directory (CRITICAL!)
1. Click **"Settings"** tab (left sidebar)
2. Scroll down to **"Build"** section
3. Find **"Root Directory"** field
4. Enter: `HerbalTrace/backend`
5. Click **"Update"** or the checkmark ✓

### Step 3: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
   OR
3. Click **"Deploy"** button at top right

---

## 📋 Complete Railway Configuration Checklist

### In Settings Tab:

#### 1. Root Directory
```
HerbalTrace/backend
```
✅ This tells Railway where your package.json is

#### 2. Build Command (Auto-detected)
```
npm install && npm run build
```
Should auto-detect this from package.json

#### 3. Start Command (Auto-detected)
```
npm start
```
Should auto-detect this from package.json

---

## 🔑 Environment Variables to Add

Go to **"Variables"** tab and add:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=change-this-to-random-secure-string-min-32-chars
CORS_ORIGINS=*
USE_BLOCKCHAIN=false
```

Click **"Add Variable"** after each one.

---

## 🌐 Generate Domain

After successful deployment:

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy your URL (e.g., `herbaltrace-production.up.railway.app`)

---

## ✅ Verify Deployment

### Check Build Logs
In **"Deployments"** tab, click on the latest deployment to see logs.

**Successful build should show:**
```
✓ Build succeeded
✓ Starting deployment
```

### Test Your API
Visit in browser:
```
https://your-railway-url.up.railway.app/
```

Should return:
```json
{
  "name": "HerbalTrace API",
  "version": "1.0.0",
  "status": "online"
}
```

---

## 🚨 If Still Failing

### Check Build Logs For:

**Error:** `Cannot find module`
- **Solution:** Make sure root directory is `HerbalTrace/backend`

**Error:** `TypeScript compilation failed`
- **Solution:** Check code has no syntax errors

**Error:** `Port already in use`
- **Solution:** Environment variable PORT should be blank (Railway auto-assigns)

---

## 📸 Screenshot Guide

### Where to Set Root Directory:

```
Railway Dashboard
├── Your Project
│   ├── Settings (← Click here)
│   │   └── Build
│   │       └── Root Directory: [HerbalTrace/backend] ← Type here
│   │
│   ├── Variables (← Add env vars here)
│   └── Deployments (← Click Redeploy here)
```

---

## 💡 Quick Command to Check GitHub

Make sure latest code is pushed:

```powershell
git status
git log -1  # Should show: "Fix Railway deployment config"
```

---

## ✅ Final Checklist

- [ ] Railway project created
- [ ] Root directory set to `HerbalTrace/backend`
- [ ] Environment variables added
- [ ] Deployment successful (green checkmark)
- [ ] Domain generated
- [ ] API accessible in browser
- [ ] Test endpoint returns JSON response

---

## 🎯 Expected Timeline

1. **Set root directory:** 30 seconds
2. **Add environment variables:** 1 minute
3. **Redeploy:** 2-3 minutes (build time)
4. **Generate domain:** 30 seconds
5. **Test API:** 30 seconds

**Total:** ~5 minutes from now!

---

## 📞 Still Need Help?

1. **Check Railway logs** in Deployments tab
2. **Copy error message** and check against common errors above
3. **Verify root directory** is exactly `HerbalTrace/backend`

---

**Let's get this deployed!** 🚀

Once you set the root directory and redeploy, it should work perfectly!
