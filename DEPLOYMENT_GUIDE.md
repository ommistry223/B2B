# 🚀 Deployment Guide - CreditFlow Pro

## 📋 Overview

Your app has 3 components that need deployment:

1. **Frontend (React)** → Deploy to Netlify ✅
2. **Backend (Node.js)** → Deploy to Railway/Render 🔧
3. **Database (PostgreSQL)** → Use Neon/Supabase 🗄️

---

## 🎨 Part 1: Deploy Frontend to Netlify

### Option A: Deploy via Netlify Dashboard (Easiest)

1. **Go to Netlify**

   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub**

   - Choose "GitHub"
   - Authorize Netlify
   - Select repository: `ommistry223/B2B`

3. **Configure Build Settings**

   - Netlify will auto-detect these settings:

   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Add Environment Variables**

   - Click "Site settings" → "Environment variables"
   - Add these variables:

   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_OPENAI_API_KEY=your-new-openai-key-here (optional)
   ```

5. **Deploy**

   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site will be live at: `https://random-name.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Update DNS records

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
cd E:\B2B
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Build command: npm run build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

---

## 🖥️ Part 2: Deploy Backend to Railway (Recommended)

### Why Railway?

- ✅ Free tier with $5/month credit
- ✅ PostgreSQL database included
- ✅ Automatic deployments from GitHub
- ✅ Environment variables management

### Steps:

1. **Create Railway Account**

   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select `ommistry223/B2B`

3. **Configure Service**

   - Railway will detect Node.js
   - Set root directory: `backend`
   - Start command: `node server.js`

4. **Add PostgreSQL Database**

   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database
   - Get connection details from "Variables" tab

5. **Set Environment Variables**

   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=generate-a-strong-random-secret-key-here
   DB_HOST=${{PGHOST}}
   DB_PORT=${{PGPORT}}
   DB_NAME=${{PGDATABASE}}
   DB_USER=${{PGUSER}}
   DB_PASSWORD=${{PGPASSWORD}}
   FRONTEND_URL=https://your-app.netlify.app
   ```

6. **Deploy**

   - Click "Deploy"
   - Get your backend URL: `https://xxx.railway.app`

7. **Run Database Migration**
   - Go to PostgreSQL service
   - Click "Query" tab
   - Run your database schema from `DATABASE_SETUP_GUIDE.md`

### Alternative: Deploy Backend to Render

1. Go to https://render.com
2. Create "New Web Service"
3. Connect GitHub repo
4. Set:
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   ```
5. Add PostgreSQL database
6. Configure environment variables

---

## 🗄️ Part 3: Database Options

### Option A: Use Railway PostgreSQL (Easiest)

- Automatically created with backend
- Free tier included
- No extra setup needed

### Option B: Neon (Serverless PostgreSQL)

1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Add to Railway environment variables

### Option C: Supabase

1. Go to https://supabase.com
2. Create project
3. Get PostgreSQL connection details
4. Run database schema
5. Update environment variables

---

## 🔗 Connect Frontend to Backend

After deploying backend to Railway:

1. **Get Backend URL**

   - From Railway dashboard: `https://your-app.railway.app`

2. **Update Netlify Environment Variable**

   - Go to Netlify site settings
   - Environment variables
   - Update `VITE_API_URL` to: `https://your-app.railway.app/api`

3. **Redeploy Frontend**
   - Netlify will auto-redeploy
   - Or trigger manual deploy

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads on Netlify URL
- [ ] Backend responds at `/api/health` or similar endpoint
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can create customers
- [ ] Can create invoices
- [ ] Can record payments
- [ ] Dashboard shows data correctly

---

## 🔐 Security Checklist

- [ ] Changed JWT_SECRET in production
- [ ] Revoked and regenerated OpenAI API key
- [ ] Database has strong password
- [ ] CORS configured for your Netlify domain
- [ ] HTTPS enabled (automatic on Netlify/Railway)
- [ ] Environment variables set correctly

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** "Failed to fetch" errors

- **Solution:** Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

**Problem:** Blank page after deployment

- **Solution:** Check build logs in Netlify
- Verify `npm run build` works locally
- Check for missing environment variables

### Backend Issues

**Problem:** Backend won't start

- **Solution:** Check Railway logs
- Verify all environment variables are set
- Check database connection string

**Problem:** Database connection errors

- **Solution:** Run database schema
- Verify database credentials
- Check if database is running

---

## 📊 Monitoring

### Netlify

- View analytics at: https://app.netlify.com/sites/YOUR_SITE/analytics
- Check deploy logs for errors

### Railway

- View logs: Railway dashboard → Service → Logs
- Monitor usage: Metrics tab

---

## 💰 Cost Estimate

**Free Tier:**

- Netlify: 100GB bandwidth/month (Free forever)
- Railway: $5/month credit (Free for small apps)
- Total: **$0-5/month**

**Paid (if you exceed free tier):**

- Netlify Pro: $19/month
- Railway: Pay as you go (~$10-20/month)

---

## 🎯 Next Steps After Deployment

1. Set up custom domain
2. Configure email notifications
3. Add Google Analytics
4. Set up database backups
5. Monitor performance
6. Add SSL certificate (automatic)

---

## 🆘 Need Help?

- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Your app will be live at:**

- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-app.railway.app`

🎉 **Happy Deploying!**
