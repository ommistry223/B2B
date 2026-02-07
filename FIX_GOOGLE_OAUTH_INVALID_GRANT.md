# Fixing Google OAuth "invalid_grant" Error

## Error in Render Logs

```
Error ApiError: Google token exchange failed: invalid_grant
```

## Root Cause

The `invalid_grant` error occurs when Google OAuth redirect URIs are not properly configured in Google Cloud Console.

## ✅ Fix Steps

### 1. Go to Google Cloud Console

https://console.cloud.google.com/apis/credentials

### 2. Find Your OAuth 2.0 Client ID

Look for Client ID: `1014096041944-vlnjtpp91kp92172hvhsj7mkam2u4m9q`

### 3. Click Edit (pencil icon)

### 4. Update Authorized Redirect URIs

**Remove any old/incorrect URIs and add these EXACT URIs:**

```
https://b2b-backend-qht2.onrender.com/api/auth/google/callback
https://b2b.netlify.app/auth/callback
https://bto-b.netlify.app/auth/callback
http://localhost:5000/api/auth/google/callback
http://localhost:4028/auth/callback
```

### 5. Update Authorized JavaScript Origins

**Add these EXACT origins:**

```
https://b2b-backend-qht2.onrender.com
https://b2b.netlify.app
https://bto-b.netlify.app
http://localhost:5000
http://localhost:4028
```

### 6. Save Changes

Click **Save** at the bottom

⚠️ **Important:** Changes can take 5-10 minutes to propagate

## Test After 10 Minutes

1. Go to https://b2b.netlify.app/login
2. Click "Continue with Google"
3. Should redirect to Google login
4. After login, should redirect back to your app successfully

## Common Mistakes to Avoid

❌ Having a trailing slash: `https://b2b.netlify.app/` (wrong)
✅ No trailing slash: `https://b2b.netlify.app` (correct)

❌ Wrong protocol: `http://b2b.netlify.app` (wrong)
✅ Correct protocol: `https://b2b.netlify.app` (correct)

❌ Typo in URL: `qhl2` instead of `qht2`
✅ Correct URL: `qht2`

## Alternative: Test Without Google OAuth

While waiting for Google OAuth to work, users can still:

- ✅ Register with email/password
- ✅ Login with email/password
- ✅ Use all app features

Google OAuth is just an alternative login method - not required for the app to function.
