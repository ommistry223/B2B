# Neon PostgreSQL Setup Guide

## What is Neon?

Neon is a serverless PostgreSQL database platform that offers:
- ✅ Serverless architecture (auto-scaling)
- ✅ Free tier with generous limits
- ✅ Instant database creation
- ✅ Automatic backups
- ✅ Connect from anywhere

Perfect for your B2B CreditFlow application!

---

## Quick Setup

### Step 1: Create Neon Account

1. Visit https://neon.tech
2. Click **"Sign Up"** (use GitHub for faster signup)
3. Verify your email

### Step 2: Create a Project

1. Click **"Create Project"** or **"New Project"**
2. Configure:
   - **Project name**: `b2b-creditflow` (or your choice)
   - **Region**: Choose closest to your users
   - **PostgreSQL version**: Latest (default)
3. Click **"Create Project"**

### Step 3: Get Connection Details

After creation, you'll see your connection string:

```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

You can also find individual connection details:
- **Host**: `ep-xxxxx.region.aws.neon.tech`
- **Database**: `neondb`
- **Username**: `username`
- **Password**: `password`
- **Port**: `5432`

### Step 4: Add to Backend Environment Variables

#### Option A: Using Connection String (Recommended)

Add to your backend `.env` or hosting platform:

```env
DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

#### Option B: Individual Variables

```env
DB_HOST=ep-xxxxx.region.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=username
DB_PASSWORD=password
DB_SSL=true
```

### Step 5: Initialize Database Tables

Run the setup script to create tables:

```bash
cd backend
node setup-database.js
```

This will create:
- `users` table
- `customers` table
- `invoices` table
- `payments` table
- `invoice_items` table

---

## For Production Deployment

### Render

1. Go to your Render service dashboard
2. Click **"Environment"** tab
3. Add:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
4. Save and redeploy

### Vercel

1. Go to project settings
2. **Environment Variables**
3. Add:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
4. Redeploy

### Other Platforms

Look for "Environment Variables" or "Settings" section and add the `DATABASE_URL`.

---

## Testing the Connection

Create a test file `test-db.js` in backend folder:

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node test-db.js
```

---

## Neon Dashboard Features

### Monitor Usage
- Go to **Dashboard** → **Usage**
- View:
  - Storage used
  - Data transfer
  - Connection count

### Backups
- Neon automatically backs up your data
- Point-in-time recovery available
- No manual setup needed

### Branching (Development)
- Create database branches for testing
- Each branch is an isolated copy
- Perfect for testing migrations

---

## Connection Pooling (Optional but Recommended)

For production, use connection pooling:

```javascript
// In your database.postgresql.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };
```

---

## Troubleshooting

### Error: "connection refused"
**Solution:** 
- Verify connection string is correct
- Check if `sslmode=require` is in connection string
- Ensure Neon project is not suspended (free tier inactivity)

### Error: "password authentication failed"
**Solution:**
- Copy fresh connection string from Neon dashboard
- Password might have special characters that need URL encoding

### Error: "database does not exist"
**Solution:**
- Run `setup-database.js` to create tables
- Verify database name in connection string matches

### Slow Queries
**Solution:**
- Neon free tier has cold starts (wait ~1-2 seconds)
- Upgrade to paid tier for instant connections
- Use connection pooling

---

## Upgrading to Paid Tier

Free tier limits:
- 1 project
- 0.5 GB storage
- 1 branch
- Cold starts after inactivity

Paid tier benefits:
- Multiple projects
- More storage
- Always-on (no cold starts)
- Multiple branches
- Priority support

Visit: https://neon.tech/pricing

---

## Next Steps

1. ✅ Setup Neon database (you're here!)
2. 📝 Configure backend environment variables
3. 🚀 Deploy backend to your hosting platform
4. 🔐 Setup Google OAuth (see GOOGLE_OAUTH_SETUP.md)
5. 🎉 Test your application

---

## Need Help?

- 📖 Neon Documentation: https://neon.tech/docs
- 💬 Neon Community: https://neon.tech/community
- 🐛 Issues: Check backend logs for detailed errors
