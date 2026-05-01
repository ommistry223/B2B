# 🚀 Deploy Backend & Fix Google OAuth - Complete Guide

## Current Issue

- **"Failed to fetch"** error on login page
- Backend is not deployed
- Google OAuth won't work without a live backend

## ✅ Solution (15 minutes)

Follow these steps in order:

---

## STEP 1: Deploy Backend to Render (7 minutes)

### 1.1 Create Render Account

1. Go to: https://dashboard.render.com/register
2. Sign up with **GitHub** (recommended) or email
3. Verify email if needed

### 1.2 Create Web Service

1. Click **"New +"** button (top right corner)
2. Select **"Web Service"**
3. **Connect GitHub:**
   - Click **"Connect a repository"**
   - If GitHub not connected: Click **"Connect GitHub"** → Authorize Render
   - Search for your repository
   - Click **"Connect"**

### 1.3 Configure Service Settings

⚠️ **Important:** Enter these values EXACTLY:

```
Name: b2b-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend          ← IMPORTANT! Must be "backend"
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### 1.4 Add Environment Variables

Click **"Add Environment Variable"** button and add these **ONE BY ONE**:

```bash
# Basic Configuration
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Google OAuth (your existing credentials)
GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Frontend URLs
FRONTEND_URL=https://bto-b.netlify.app
FRONTEND_URLS=https://bto-b.netlify.app,http://localhost:4028

# Database (your Neon database)
DATABASE_URL=postgresql://neondb_owner:npg_KthxP89IAOud@ep-solitary-art-ahjhchhs-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**To add each variable:**

- Click **"Add Environment Variable"**
- Enter Key (e.g., `NODE_ENV`)
- Enter Value (e.g., `production`)
- Repeat for all variables above

### 1.5 Deploy!

1. Scroll down and click **"Create Web Service"**
2. Wait 2-3 minutes (watch the logs scroll)
3. Look for: **"Your service is live 🎉"**
4. **COPY YOUR URL** from the top of the page
   - Format: `https://b2b-backend-xxxx.onrender.com`
   - Click to copy or write it down

---

## STEP 2: Update Google OAuth Redirect URI (3 minutes)

### 2.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project

### 2.2 Edit OAuth Client ID

1. Find your OAuth 2.0 Client ID
   - Should show: `1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com`
2. Click the **pencil icon (✏️)** to edit

### 2.3 Add Redirect URI

In **"Authorized redirect URIs"** section, add:

```
https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback
```

**Example:** If your Render URL is `https://b2b-backend-abc123.onrender.com`, add:

```
https://b2b-backend-abc123.onrender.com/api/auth/google/callback
```

⚠️ **Important:**

- Use YOUR actual Render URL (from Step 1.5)
- Include `/api/auth/google/callback` at the end
- Use `https://` not `http://`

### 2.4 Save

1. Click **"Save"** at the bottom
2. Wait 30 seconds for changes to propagate

---

## STEP 3: Update Netlify Environment Variable (3 minutes)

### 3.1 Go to Netlify

1. Visit: https://app.netlify.com/
2. Click on your site (e.g., `bto-b`)

### 3.2 Update API URL

1. Go to **"Site configuration"** (left sidebar)
2. Click **"Environment variables"**
3. Find `VITE_API_URL` or click **"Add a variable"**
4. Set:

   ```
   Key: VITE_API_URL
   Value: https://YOUR-RENDER-URL.onrender.com/api
   ```

   **Example:** If your Render URL is `https://b2b-backend-abc123.onrender.com`:

   ```
   https://b2b-backend-abc123.onrender.com/api
   ```

5. Click **"Save"**

### 3.3 Redeploy Netlify

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-3 minutes for deployment

---

## STEP 4: Test Everything (2 minutes)

### 4.1 Test Backend

1. Open: `https://YOUR-RENDER-URL.onrender.com/api/health`
2. Should see:
   ```json
   {
     "status": "OK",
     "message": "B2B Backend API is running",
     "timestamp": "..."
   }
   ```

### 4.2 Test Frontend

1. Go to: https://bto-b.netlify.app/login
2. The "Failed to fetch" error should be **GONE**
3. Click **"Sign in with Google"**
4. You should see Google's login screen
5. After logging in, you'll be redirected back to your app

---

## ✅ Success Checklist

- [ ] Backend deployed to Render
- [ ] Render service URL copied
- [ ] All 8 environment variables added to Render
- [ ] Google OAuth redirect URI updated with Render URL
- [ ] Netlify environment variable updated with Render URL
- [ ] Netlify site redeployed (cache cleared)
- [ ] Backend health check returns OK
- [ ] Login page loads without "Failed to fetch" error
- [ ] Google OAuth button works
- [ ] Successfully logged in with Google

---

## 🆘 Troubleshooting

### "Failed to fetch" still appears

**Cause:** Netlify hasn't redeployed yet or wrong URL
**Fix:**

1. Check Netlify Deploys tab - is it done?
2. Verify `VITE_API_URL` is correct in Netlify
3. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "redirect_uri_mismatch" error

**Cause:** Google OAuth redirect URI doesn't match
**Fix:**

1. Check the error message - it shows the exact URI being used
2. Copy that EXACT URI
3. Add it to Google Cloud Console → OAuth Client → Authorized redirect URIs
4. Make sure there's no space, trailing slash, or typo

### Backend health check fails (404 or timeout)

**Cause:** Render deployment failed or service is sleeping
**Fix:**

1. Go to Render dashboard
2. Check the **Logs** tab
3. Look for errors
4. Render free tier sleeps after 15 min - first request takes 30-60 seconds
5. Wait and try again

### Google login redirects but shows error

**Cause:** Missing environment variables on Render
**Fix:**

1. Go to Render → Your service → Environment
2. Verify ALL 8 variables are set
3. Especially check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. If you added variables after deployment, click **"Manual Deploy"**

---

## 📋 Quick Reference

**Your URLs:**

- Frontend: `https://bto-b.netlify.app`
- Backend: `https://YOUR-RENDER-URL.onrender.com` (get from Render dashboard)
- Backend API: `https://YOUR-RENDER-URL.onrender.com/api`
- Health Check: `https://YOUR-RENDER-URL.onrender.com/api/health`

**Your Google OAuth:**

- Client ID: `1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com`
- Redirect URI: `https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback`

**Environment Variables for Render:**

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=https://bto-b.netlify.app
FRONTEND_URLS=https://bto-b.netlify.app,http://localhost:4028
DATABASE_URL=postgresql://neondb_owner:npg_KthxP89IAOud@ep-solitary-art-ahjhchhs-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🎉 You're Done!

After completing all 4 steps, your Google OAuth will work perfectly!

**Login flow:**

1. User clicks "Sign in with Google" on your site
2. User is redirected to Google's login page
3. User approves the permissions
4. Google redirects back to your backend on Render
5. Backend creates/finds user and generates JWT token
6. User is redirected back to your frontend with token
7. User is logged in!

---

## Need Help?

If you're stuck:

1. Check the **Troubleshooting** section above
2. Look at Render logs: Dashboard → Your Service → Logs
3. Check browser console: F12 → Console tab
4. Verify all URLs are correct (no typos!)
