# FIXING 500 INTERNAL SERVER ERROR - Production Setup Guide

## Problem

Your backend on Render is returning 500 Internal Server Error when users try to login. This is likely due to misconfigured environment variables in production.

## Root Causes Identified:

1. ❌ **Missing or incorrect environment variables on Render**
2. ❌ **JWT_SECRET might not be configured**
3. ❌ **Database connection issues**
4. ❌ **CORS configuration didn't include b2b.netlify.app**

## ✅ IMMEDIATE FIX - Render Environment Variables

### Step 1: Go to Render Dashboard

1. Go to https://render.com
2. Click on your backend service: `b2b-backend-qhl2`
3. Click **Environment** in the left sidebar

### Step 2: Add/Update These Environment Variables

**CRITICAL - Add these EXACT values:**

```
PORT=5000
NODE_ENV=production

FRONTEND_URL=https://b2b.netlify.app
FRONTEND_URLS=https://b2b.netlify.app,https://bto-b.netlify.app

BACKEND_URL=https://b2b-backend-qht2.onrender.com

JWT_SECRET=2237145

DB_HOST=ep-solitary-art-ahjhchhs-pooler.c-3.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_KthxP89IAOud
DB_SSL=true

GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Step 3: Save and Deploy

1. Click **Save Changes** at the bottom
2. Render will automatically redeploy your service
3. Wait 2-3 minutes for deployment to complete

## ✅ Verify the Fix

### Check Backend Health

Open this URL in your browser:

```
https://b2b-backend-qht2.onrender.com/api/health
```

You should see:

```json
{
  "status": "OK",
  "message": "B2B Backend API is running",
  "timestamp": "2026-02-07T..."
}
```

### Check Backend Logs on Render

1. In Render dashboard, click **Logs** tab
2. Look for these success messages:
   - ✅ Connected to PostgreSQL database
   - ✅ Database connection successful
   - 🚀 Server is running on port 5000
   - 🔑 JWT Secret: ✓ Configured

### Test Login

1. Go to https://b2b.netlify.app/login
2. Try logging in with your credentials
3. Should work without 500 error

## ✅ Code Changes Made (Already Done)

1. **Updated CORS** - Added `b2b.netlify.app` to allowed origins
2. **Added database connection test** - Server now checks DB on startup
3. **Enhanced error logging** - Better debugging information
4. **JWT_SECRET validation** - Checks if JWT secret is configured

## 🔧 If Still Having Issues

### Database Not Connected?

Run the database setup script:

```bash
cd backend
node setup-database.js
```

### Check Database Tables Exist

Go to: https://console.neon.tech

1. Click on your project
2. Go to SQL Editor
3. Run:

```sql
SELECT * FROM users LIMIT 5;
```

If you get error "relation users does not exist", run setup-database.js

### Google OAuth Not Working?

1. Go to https://console.cloud.google.com
2. Go to APIs & Services > Credentials
3. Find your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   - `https://b2b-backend-qht2.onrender.com/api/auth/google/callback`
   - `https://b2b.netlify.app/auth/callback`
5. Under "Authorized JavaScript origins", add:
   - `https://b2b.netlify.app`
   - `https://b2b-backend-qht2.onrender.com`

## 📝 Next Steps After Fix

1. **Test all features**:
   - Login with email/password ✓
   - Login with Google OAuth ✓
   - Register new user ✓
   - Access dashboard ✓

2. **Monitor logs** on Render dashboard for any errors

3. **Update JWT_SECRET** to a more secure random string (optional but recommended):
   ```
   Generate a secure random string and update JWT_SECRET in Render
   ```

## ⚠️ Important Security Note

The current JWT_SECRET (`2237145`) is weak. For production, generate a strong random secret:

```bash
# Run this to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update JWT_SECRET in Render with the generated value.

## 🎉 Expected Result

After following these steps:

- ✅ No more 500 errors
- ✅ Login works perfectly
- ✅ Google OAuth works
- ✅ All API endpoints respond correctly
