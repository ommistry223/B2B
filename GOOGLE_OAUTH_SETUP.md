# Google OAuth Setup Guide

## Issue

Your backend is returning: `{"error":"message":"Google OAuth is not configured","status":500}`

This means the backend environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are missing.

---

## ✅ Solution: Set Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `B2B CreditFlow` or similar
   - Click "Create"

3. **Enable Google+ API**
   - In the search bar, type "Google+ API"
   - Click "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Choose "External" (unless you have Google Workspace)
   - Click "Create"

   **Fill in the form:**
   - App name: `B2B CreditFlow`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"

   **Scopes:**
   - Click "Add or Remove Scopes"
   - Select: `email`, `profile`, `openid`
   - Click "Update" → "Save and Continue"

   **Test Users (for development):**
   - Add your email address
   - Click "Save and Continue"

5. **Create OAuth Client ID**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `B2B CreditFlow Web`

   **Authorized JavaScript origins:**

   ```
   https://your-backend-domain.com
   ```

   > Replace with your actual backend URL (e.g., Render, Vercel, your own server)

   **Authorized redirect URIs:**

   ```
   https://your-backend-domain.com/api/auth/google/callback
   ```

   > Replace with your actual backend URL + `/api/auth/google/callback`
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a popup with:
     - `Client ID` (looks like: `xxxxx.apps.googleusercontent.com`)
     - `Client Secret` (random string)
   - **⚠️ Save these securely - you'll need them in the next step**

---

### Step 2: Add Credentials to Your Backend

1. **Add Environment Variables to Your Backend**

   Depending on where your backend is hosted:

   **If using Render/Vercel/Other hosting:**
   - Go to your project dashboard
   - Find "Environment Variables" or "Settings"
   - Add these variables:

   ```
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

   **If running locally:**
   - Create/edit `.env` file in `backend/` folder
   - Add the same variables above

2. **Configure Database (Neon)**
   - Your backend uses Neon PostgreSQL
   - Make sure these environment variables are also set:

   ```
   DATABASE_URL=your-neon-connection-string
   DB_HOST=your-neon-host.neon.tech
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   ```

3. **Restart/Redeploy**
   - Restart your backend server or redeploy
   - Wait 1-2 minutes for changes to take effect

---

### Step 3: Test Google Login

1. **Go to Your App**
   - Visit: Your Netlify URL (from browser)

2. **Click Google Login**
   - You should see Google's login page
   - Select your account
   - Grant permissions
   - You'll be redirected back and logged in ✅

---

## 🔧 Troubleshooting

### Error: "Redirect URI mismatch"

**Solution:** Make sure the redirect URI in Google Console matches exactly:

```
https://your-backend-domain.com/api/auth/google/callback
```

> Replace `your-backend-domain.com` with your actual backend URL

### Error: "Access blocked: This app's request is invalid"

**Solution:**

- Verify OAuth consent screen is configured
- Add yourself as a test user if app is in "Testing" mode

### Error: Still says "not configured"

**Solution:**

- Verify environment variables are added to your backend hosting platform
- Check backend deployment logs for errors
- Make sure the backend redeployed after adding variables
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

---

## 📝 Local Development Setup

If you want to test Google OAuth locally:

1. **Add to Google Console Authorized URIs:**

   ```
   http://localhost:5000
   http://localhost:5000/api/auth/google/callback
   ```

2. **Create `.env` file in backend folder:**

   ```env
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:4028
   ```

3. **Restart backend server**

---

## 🎉 Done!

Your Google OAuth should now work. Users can now sign in with Google!
