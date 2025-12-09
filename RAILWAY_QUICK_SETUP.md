# 🚀 Quick Railway Setup - 5 Minutes

## ✅ GitHub Push Complete!

Your code is now at: **https://github.com/kunaldubey10/Herb**

---

## 📋 Step-by-Step Railway Deployment

### Step 1: Sign Up on Railway (30 seconds)

1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 2: Create New Project (1 minute)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"kunaldubey10/Herb"**
4. Railway will automatically:
   - Detect Node.js project
   - Run `npm install`
   - Run `npm run build`
   - Start with `npm start`

### Step 3: Configure Root Directory (Important!)

1. In Railway dashboard, click your service
2. Go to **Settings** tab
3. Under **Build**, set:
   - **Root Directory:** `HerbalTrace/backend`
4. Click **Save**

### Step 4: Add Environment Variables (2 minutes)

Click **Variables** tab and add:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=change-this-to-a-random-secure-string
CORS_ORIGINS=*
USE_BLOCKCHAIN=false
```

Click **"Add Variable"** for each one.

### Step 5: Generate Domain (30 seconds)

1. Go to **Settings** tab
2. Scroll to **Networking**
3. Click **"Generate Domain"**
4. You'll get a URL like: `herbaltrace-production.up.railway.app`

### Step 6: Test Your API (30 seconds)

```bash
# In browser or curl
https://your-app.up.railway.app/
```

You should see:
```json
{
  "name": "HerbalTrace API",
  "version": "1.0.0",
  "status": "online"
}
```

---

## 📱 Update Your Flutter App

Copy your Railway URL and update:

```dart
class ApiConfig {
  static const String BASE_URL = 'https://your-app.up.railway.app/api/v1';
}
```

Replace `your-app.up.railway.app` with your actual Railway domain.

---

## 🧪 Test From Flutter App

1. **Rebuild your Flutter app** with new API URL
2. **Install APK** on your mobile device
3. **Test login** with:
   - Username: `farmer-1765221082597-p4a9`
   - Password: `Farmer123`

---

## 🔧 Important Configuration

### Database Note

Railway deployment uses **SQLite** which is **ephemeral** (data resets on restart).

For production, upgrade to **PostgreSQL**:

1. In Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-injects `DATABASE_URL`
3. Update your backend to use PostgreSQL

### Blockchain Note

Currently set to: `USE_BLOCKCHAIN=false`

This means:
- ✅ All API endpoints work
- ✅ Data saves to database
- ⚠️ No blockchain transactions (mock mode)

For full blockchain:
- Keep blockchain running locally
- Use ngrok to expose blockchain
- Update connection profile
- Set `USE_BLOCKCHAIN=true`

---

## 📊 Monitor Your App

Railway provides:
- **📈 Metrics:** CPU, Memory, Network
- **📝 Logs:** Real-time application logs
- **🔄 Deployments:** Auto-deploy on git push
- **⚙️ Settings:** Environment variables

---

## 💡 Auto-Deploy on Push

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin clean-main
```

Railway will **automatically**:
1. Detect the push
2. Build your app
3. Deploy the new version
4. Zero downtime!

---

## 🚨 Troubleshooting

### Build Failed

**Check:**
- Root directory is set to `HerbalTrace/backend`
- `package.json` has `build` and `start` scripts
- No syntax errors in TypeScript

**View logs** in Railway dashboard

### App Crashed

**Check:**
- Environment variables are set
- Database connection is working
- View logs for error messages

### Can't Connect

**Check:**
- Domain is generated
- App shows "Active" status
- Try: `https://your-app.up.railway.app/health`

---

## 💰 Pricing

- **Starter:** $5 credit/month (free)
- **Developer:** $5/month (after credit runs out)
- **Usage-based:** Pay only for what you use

Estimated cost for light usage: **$5-10/month**

---

## ✅ Success Checklist

- [x] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project deployed
- [ ] Root directory set to `HerbalTrace/backend`
- [ ] Environment variables added
- [ ] Domain generated
- [ ] API tested in browser
- [ ] Flutter app updated with new URL
- [ ] Mobile app tested successfully

---

## 🎉 You're Done!

Your backend is now live at:
```
https://your-app.up.railway.app
```

Your Flutter app can connect from **anywhere in the world**!

No more:
- ❌ Same WiFi network required
- ❌ Firewall configuration
- ❌ Local IP addresses
- ❌ Computer must stay on

Just pure cloud ☁️ connectivity! 🚀

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs in Railway dashboard

---

**Next:** Deploy and test your mobile app! 📱
