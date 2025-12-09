# 🚀 Railway Deployment Guide for HerbalTrace Backend

## Quick Deploy to Railway

### Step 1: Push to GitHub

```powershell
# Initialize git (if not already done)
cd d:\Trial\HerbalTrace
git init
git add .
git commit -m "Initial commit - HerbalTrace Backend"

# Create GitHub repo and push
git remote add origin https://github.com/kunaldubey10/Herb.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Go to:** https://railway.app
2. **Sign up/Login** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **`kunaldubey10/Herb`** repository
6. Railway will auto-detect Node.js and deploy!

### Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGINS=*
```

### Step 4: Get Your API URL

Railway will provide a URL like:
```
https://herbaltrace-production.up.railway.app
```

### Step 5: Update Flutter App

```dart
class ApiConfig {
  static const String BASE_URL = 'https://herbaltrace-production.up.railway.app/api/v1';
}
```

---

## ⚠️ Important: Blockchain Considerations

Your **Hyperledger Fabric blockchain is running locally** in Docker containers. Railway deployment has 2 options:

### Option A: Backend Only (Recommended for Testing)
- ✅ Deploy backend API to Railway
- ✅ Backend runs WITHOUT blockchain (mock/test mode)
- ✅ Use in-memory or Railway PostgreSQL database
- ⚠️ No actual blockchain transactions

### Option B: Full Stack (Production)
- Deploy backend + blockchain to cloud
- More complex and expensive
- Requires:
  - IBM Blockchain Platform, or
  - Azure Blockchain Service, or
  - AWS Managed Blockchain

---

## 🔧 Backend Configuration for Railway

### Update backend/src/config/blockchain.ts

Add environment check:

```typescript
// Use blockchain only in local development
const USE_BLOCKCHAIN = process.env.USE_BLOCKCHAIN === 'true';

if (!USE_BLOCKCHAIN) {
  console.log('⚠️  Running in MOCK mode (no blockchain)');
  // Use database only, skip blockchain sync
}
```

### Update backend/package.json

Ensure build script exists:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  }
}
```

---

## 🗄️ Database Options on Railway

### Option 1: SQLite (Default - Simple)
- Current setup works as-is
- Data stored in container (ephemeral)
- Good for testing

### Option 2: Railway PostgreSQL (Recommended)
- Click "New" → "Database" → "PostgreSQL"
- Railway auto-injects `DATABASE_URL`
- Update backend to use PostgreSQL instead of SQLite

---

## 📦 Files Created for Railway

- ✅ `railway.json` - Railway configuration
- ✅ `railway.toml` - Alternative config format  
- ✅ `Procfile` - Start command
- ✅ `RAILWAY_DEPLOYMENT_GUIDE.md` - This file

---

## 🚀 Alternative: One-Click Deploy

Add this button to your GitHub README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/kunaldubey10/Herb)
```

---

## 🧪 Test Your Deployment

```bash
# Test health endpoint
curl https://your-app.up.railway.app/

# Test login
curl -X POST https://your-app.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"farmer-1765221082597-p4a9","password":"Farmer123"}'
```

---

## 📊 Railway Dashboard

Monitor your app:
- **Logs:** Real-time application logs
- **Metrics:** CPU, Memory, Network usage
- **Deployments:** History of all deployments
- **Settings:** Environment variables, domains

---

## 💰 Railway Pricing

- **Free Tier:** $5 credit/month
- **Usage:** ~$0.000463/GB-hour
- **Estimated:** $5-10/month for light usage

---

## 🔐 Security Checklist

Before deploying:

- [ ] Change JWT_SECRET to strong random value
- [ ] Update CORS_ORIGINS to your Flutter app domain
- [ ] Remove `.env` file (use Railway env vars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (automatic on Railway)

---

## 🚨 Troubleshooting

### Build Failed
- Check `package.json` has `build` script
- Ensure TypeScript compiles: `npm run build`

### App Crashes
- Check logs in Railway dashboard
- Verify environment variables are set
- Check PORT is set to Railway's $PORT

### Database Issues
- For SQLite: Data is ephemeral (resets on restart)
- Solution: Use Railway PostgreSQL addon

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

**Next Steps:**
1. Push code to GitHub
2. Connect Railway to GitHub
3. Deploy!
4. Update Flutter app with new URL
