# Deploy Backend to Render (Free)

## Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `ommistry223/B2B`
   - Click "Connect"

3. **Configure Service**
   - **Name:** `b2b-backend` (or any name)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Neon Database URL
   DATABASE_URL=postgresql://username:password@hostname/database

   # Frontend URLs
   FRONTEND_URL=https://b2b.netlify.app
   FRONTEND_URLS=https://b2b.netlify.app

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   > Get your Neon DATABASE_URL from: https://console.neon.tech/ → Your Project → Connection String

5. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Copy your service URL (e.g., `https://b2b-backend.onrender.com`)

## Step 2: Update Google OAuth Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth Client ID
3. Update **Authorized redirect URIs** to:
   ```
   https://YOUR-RENDER-URL.onrender.com/api/auth/google/callback
   ```
4. Click "Save"

## Step 3: Update Netlify Environment Variables

1. Go to Netlify Dashboard: https://app.netlify.com/
2. Select your site
3. Go to: Site settings → Environment variables
4. Edit or add:
   ```
   VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api
   ```
5. Click "Save"
6. Go to "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

## Step 4: Test

1. Visit your Netlify site
2. Click "Sign in with Google"
3. Should work! ✅

---

## Alternative: Vercel (if you prefer)

Vercel is also free but requires a different setup for Node.js backends. Render is easier for this use case.

## Cost Note

- **Render Free Tier:** Your backend will sleep after 15 minutes of inactivity and take ~30 seconds to wake up on first request
- **To avoid sleep:** Upgrade to paid plan ($7/month) or use a service like UptimeRobot to ping your backend every 10 minutes
