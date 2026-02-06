# ⚡ Quick Deploy to Netlify

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub (Already Done! ✅)

Your code is at: https://github.com/ommistry223/B2B

### Step 2: Deploy Frontend to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository: **ommistry223/B2B**
5. Netlify will auto-detect settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy"**

**That's it for the frontend! ✅**

### Step 3: Add Environment Variable

After deployment:

1. Go to **Site settings** → **Environment variables**
2. Add one variable for now:
   ```
   VITE_API_URL = http://localhost:5000/api
   ```
3. We'll update this after deploying the backend

### Step 4: Deploy Your Backend

Choose your preferred hosting platform (Render, Vercel, etc.) for your Node.js backend:

**For Render:**

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: **ommistry223/B2B**
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables (see backend/.env.example)
6. Click **"Create Web Service"**

**For Vercel:**

1. Go to https://vercel.com
2. Import your GitHub repo
3. Configure root directory: `backend`
4. Add environment variables
5. Deploy

### Step 5: Setup Neon Database

1. **Go to Neon**: https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to your backend environment variables:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
5. Initialize database tables (see backend/setup-database.js)

### Step 6: Get Your URLs

**Frontend URL** (from Netlify):

```
https://your-site-name.netlify.app
```

**Backend URL** (from your hosting provider):

```
https://your-backend.onrender.com/api
# or
https://your-backend.vercel.app/api
```

### Step 7: Update Frontend Environment Variable

1. Go back to Netlify
2. **Site settings** → **Environment variables**
3. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
4. Click **"Save"**
5. Trigger a redeploy: **Deploys** → **Trigger deploy**

### Step 7: Setup Database

1. In Railway, go to your PostgreSQL service
2. Click **"Connect"**
3. Use the connection details
4. Run this SQL (from DATABASE_SETUP_GUIDE.md):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  business_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy rest from DATABASE_SETUP_GUIDE.md
```

## ✅ Done!

Your app is now live:

- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-app.railway.app

## 🎯 What's Next?

- [ ] Change JWT_SECRET in Railway
- [ ] Add custom domain in Netlify
- [ ] Test registration/login
- [ ] Add customers and create invoices

## 💡 Tips

- **Free Limits:**
  - Netlify: 100GB bandwidth/month
  - Railway: $5 credit/month

- **Custom Domain:**
  - In Netlify: Domain settings → Add custom domain
  - Update DNS with your provider

- **Automatic Deploys:**
  - Push to GitHub → Auto-deploy to Netlify
  - Push to GitHub → Auto-deploy to Railway

---

📖 **Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
