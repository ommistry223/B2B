# Fix Google OAuth Error - Complete Guide

## Current Error
**Error 400: redirect_uri_mismatch** - This happens because your backend isn't deployed yet.

## ✅ Complete Fix (Follow These Steps)

### Step 1: Deploy Backend to Render (5 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Click "Sign Up" or "Login" (use GitHub for easy connection)

2. **Create New Web Service**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**
   - Click **"Connect a repository"**
   - Find and select: **`ommistry223/B2B`**
   - Click **"Connect"**

3. **Configure the Service**
   Fill in these details:
   
   - **Name:** `b2b-backend` (or any name you like)
   - **Region:** `Oregon (US West)` (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ IMPORTANT
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Select **"Free"**

4. **Scroll Down - Add Environment Variables**
   Click **"Add Environment Variable"** and add these ONE BY ONE:

   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=super-secret-change-this-random-key-12345678
   ```

   ⚠️ **STOP HERE** - Click **"Create Web Service"** button at the bottom

5. **Wait for Deployment**
   - Render will start building (2-3 minutes)
   - You'll see logs scrolling
   - Wait until you see: **"Your service is live 🎉"**
   - **Copy your service URL** (looks like: `https://b2b-backend.onrender.com`)

---

### Step 2: Get Neon Database Connection String

1. **Go to Neon Console**
   - Visit: https://console.neon.tech/
   - Select your project

2. **Get Connection String**
   - Go to **"Connection Details"** or **"Dashboard"**
   - Copy the **"Connection string"** (looks like):
     ```
     postgresql://username:password@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```

3. **Add to Render**
   - Go back to Render dashboard
   - Click your service: **b2b-backend**
   - Go to **"Environment"** tab (left sidebar)
   - Click **"Add Environment Variable"**
   - Add:
     ```
     Key: DATABASE_URL
     Value: [paste your Neon connection string here]
     ```
   - Click **"Save Changes"**

---

### Step 3: Update Google OAuth Settings

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project

2. **Edit OAuth Client ID**
   - Find your OAuth 2.0 Client ID
   - Click the pencil icon (✏️) to edit

3. **Update Authorized Redirect URIs**
   - In the **"Authorized redirect URIs"** section
   - **ADD** this new URI (replace with YOUR Render URL):
     ```
     https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback
     ```
     Example:
     ```
     https://b2b-backend.onrender.com/api/auth/google/callback
     ```
   
4. **Also Add Your Netlify Frontend**
   - In **"Authorized JavaScript origins"** ADD:
     ```
     https://bto-b.netlify.app
     ```
   
5. **Save**
   - Click **"Save"** button at the bottom

---

### Step 4: Add Google OAuth to Render

1. **Back to Render Dashboard**
   - Go to your service: **b2b-backend**
   - Click **"Environment"** tab

2. **Add Google OAuth Variables**
   Click **"Add Environment Variable"** twice to add:
   
   ```
   Key: GOOGLE_CLIENT_ID
   Value: your-client-id.apps.googleusercontent.com
   
   Key: GOOGLE_CLIENT_SECRET
   Value: your-client-secret
   ```
   
   > Get these from: https://console.cloud.google.com/apis/credentials

3. **Add Frontend URL**
   ```
   Key: FRONTEND_URL
   Value: https://bto-b.netlify.app
   
   Key: FRONTEND_URLS
   Value: https://bto-b.netlify.app
   ```

4. **Save Changes**
   - Render will automatically redeploy (1-2 minutes)

---

### Step 5: Update Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Select your site: **bto-b**

2. **Update Environment Variable**
   - Go to: **Site settings** → **Environment variables**
   - Find `VITE_API_URL` or click **"Add a variable"**
   - Set:
     ```
     Key: VITE_API_URL
     Value: https://YOUR-RENDER-URL.onrender.com/api
     ```
     Example:
     ```
     https://b2b-backend.onrender.com/api
     ```

3. **Trigger Redeploy**
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Wait 2-3 minutes

---

### Step 6: Test! 🎉

1. **Visit Your App**
   - Go to: https://bto-b.netlify.app/login

2. **Click "Sign in with Google"**
   - Should redirect to Google login ✅
   - Select your account
   - Grant permissions
   - You'll be redirected back and logged in! 🎉

---

## 🔧 Troubleshooting

### Still getting "redirect_uri_mismatch"?
- **Check:** The redirect URI in Google Console EXACTLY matches:
  ```
  https://your-exact-render-url.onrender.com/api/auth/google/callback
  ```
- No trailing slashes, correct protocol (https), correct path (/api/auth/google/callback)

### Backend not responding?
- **Check Render Logs:** In Render dashboard, click "Logs" tab
- Look for errors related to DATABASE_URL or missing environment variables

### Google shows "This app isn't verified"?
- This is normal for apps in testing mode
- Click "Advanced" → "Go to [App Name] (unsafe)"
- OR: Add your email as a test user in Google Console

### Backend taking 30+ seconds to respond?
- This is normal for Render free tier (it sleeps after 15 min)
- First request wakes it up (~30 seconds)
- Subsequent requests are fast

---

## 📝 Summary of URLs You Need

Make sure you have these ready:

- **Render Backend URL:** `https://your-service.onrender.com`
- **Netlify Frontend URL:** `https://bto-b.netlify.app`
- **Neon Database URL:** `postgresql://user:pass@host.neon.tech/db`
- **Google Client ID:** From Google Cloud Console
- **Google Client Secret:** From Google Cloud Console

---

## ✅ Checklist

- [ ] Backend deployed to Render
- [ ] DATABASE_URL added to Render
- [ ] Google OAuth credentials added to Render
- [ ] FRONTEND_URL added to Render
- [ ] Google OAuth redirect URI updated
- [ ] Netlify VITE_API_URL updated
- [ ] Netlify redeployed
- [ ] Google login tested and working!

---

Need help? Check each step carefully and make sure all URLs match exactly!
