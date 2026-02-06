# 🔧 Fix Google OAuth - Quick Solution

## Problem

Your frontend was pointing to `your-backend-domain.com` which doesn't exist, causing a 403 Forbidden error.

## ✅ Solution (Follow These Steps)

### Step 1: Deploy Backend to Render (7 minutes)

#### 1.1 Create Render Account

1. Go to: https://dashboard.render.com/register
2. Sign up with GitHub (easier) or email
3. Verify your email if needed

#### 1.2 Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect a repository"**
   - If not connected, click **"Connect GitHub"** and authorize Render
   - Find and select your repository
   - Click **"Connect"**

#### 1.3 Configure Service

Fill in these EXACT values:

| Setting            | Value                                |
| ------------------ | ------------------------------------ |
| **Name**           | `b2b-backend` (or any name you like) |
| **Region**         | `Oregon (US West)` or closest to you |
| **Branch**         | `main`                               |
| **Root Directory** | `backend` ⚠️ IMPORTANT               |
| **Runtime**        | `Node`                               |
| **Build Command**  | `npm install`                        |
| **Start Command**  | `node server.js`                     |
| **Instance Type**  | **Free**                             |

#### 1.4 Add Environment Variables

Click **"Add Environment Variable"** and add these ONE BY ONE:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=https://bto-b.netlify.app
FRONTEND_URLS=https://bto-b.netlify.app,http://localhost:4028
```

**Database URL** (from your Neon database):

```
DATABASE_URL=postgresql://neondb_owner:npg_KthxP89IAOud@ep-solitary-art-ahjhchhs-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### 1.5 Deploy

1. Click **"Create Web Service"** at the bottom
2. Wait 2-3 minutes while Render builds and deploys
3. Look for **"Your service is live 🎉"**
4. **COPY YOUR SERVICE URL** - looks like: `https://b2b-backend-xxxx.onrender.com`
   - Click the URL at the top of the page to copy it

---

### Step 2: Update Google OAuth Redirect URIs (3 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Make sure you're in the correct project

2. **Edit OAuth Client ID**
   - Find your OAuth 2.0 Client ID (the one ending in `.apps.googleusercontent.com`)
   - Click the **pencil icon (✏️)** to edit

3. **Add Authorized Redirect URIs**
   Add these TWO redirect URIs:

   ```
   https://b2b-production-febe.up.railway.app/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```

   The first one is for production (Railway backend)
   The second one is for local development

4. **Save Changes**
   - Click **"Save"** at the bottom
   - Wait 30 seconds for changes to propagate

---

### Step 3: Verify Backend Environment Variables

Make sure your Railway backend has these environment variables set:

```
GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://bto-b.netlify.app
```

To check/update:

1. Go to Railway dashboard: https://railway.app/
2. Select your project
3. Click on your service
4. Go to **"Variables"** tab
5. Verify the above variables are set

---

### Step 4: Test Google OAuth

1. **Wait for Netlify deployment to finish** (check the Deploys tab)

2. **Open your site** (e.g., `https://bto-b.netlify.app`)

3. **Click "Sign in with Google"**

4. **You should see:**
   - Google's authorization screen
   - After approving, you'll be redirected back to your app
   - You should be logged in successfully

---

## 🎯 Quick Checklist

- [ ] Updated `VITE_API_URL` in Netlify to Railway backend URL
- [ ] Redeployed Netlify site (clear cache)
- [ ] Added Railway callback URL to Google OAuth redirect URIs
- [ ] Added localhost callback URL for development
- [ ] Verified Railway backend has Google OAuth credentials
- [ ] Tested Google login on deployed site

---

## 🆘 Troubleshooting

### If you still get "redirect_uri_mismatch" error:

1. **Check the exact error URL**
   - The error message shows which redirect_uri was used
   - Make sure it EXACTLY matches what you added in Google Console
   - No trailing slashes, exact protocol (http vs https)

2. **Common mistakes:**
   - Forgot `/api` in the URL
   - Used `/google/callback` instead of `/api/auth/google/callback`
   - Typo in the domain name
   - HTTP instead of HTTPS

### If you get 403 Forbidden:

1. **Check Railway backend is running:**
   - Visit: `https://b2b-production-febe.up.railway.app/api/health`
   - Should return: `{"status":"OK",...}`

2. **Check CORS settings:**
   - Railway backend should allow your Netlify domain
   - Check `backend/server.js` CORS configuration

### If you get "Google OAuth is not configured" error:

1. **Railway backend is missing environment variables**
2. **Go to Railway → Variables tab**
3. **Add:**
   ```
   GOOGLE_CLIENT_ID=1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   ```

---

## 📝 Summary

The issue was that your `netlify.toml` file had a placeholder URL:

```
VITE_API_URL = "https://your-backend-domain.com/api"  ❌
```

Changed to your actual Railway backend:

```
VITE_API_URL = "https://b2b-production-febe.up.railway.app/api"  ✅
```

Now Google OAuth will redirect to the correct backend URL!

---

## 🎉 Done!

After completing all steps, your Google OAuth should work perfectly.

If you need help, check the error message and refer to the Troubleshooting section above.
