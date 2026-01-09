# 🚀 Quick Start - PostgreSQL Setup

## What You Need:

1. PostgreSQL installed
2. pgAdmin 4 working
3. Database created
4. Tables created

---

## 📋 QUICK STEPS:

### 1️⃣ Install PostgreSQL

Download from: https://www.postgresql.org/download/windows/

- Remember your password!
- Keep port 5432

### 2️⃣ Open pgAdmin 4

- Windows Start → pgAdmin 4
- Enter your password

### 3️⃣ Create Database

- Right-click "Databases" → Create → Database
- Name: `b2b_creditflow`
- Save

### 4️⃣ Run SQL Script

- Right-click `b2b_creditflow` → Query Tool
- Copy ALL SQL from `POSTGRESQL_SETUP.md` (Step 5)
- Paste and Execute (F5)

### 5️⃣ Install Package

```bash
cd backend
npm install pg
```

### 6️⃣ Update .env

Edit `backend/.env`:

```env
DB_PASSWORD=your_actual_password
```

### 7️⃣ Test Connection

```bash
cd backend
node test-db-connection.js
```

Should see: ✅ SUCCESS!

### 8️⃣ Update server.js

Change line 6:

```javascript
// OLD:
import { db } from './services/database.service.js'

// NEW:
import { db } from './services/database.postgresql.js'
```

### 9️⃣ Restart Backend

```bash
cd backend
node server.js
```

Should see: ✅ Connected to PostgreSQL database

### 🔟 Test App

- Open http://localhost:4028
- Register new account
- Add customers
- Check pgAdmin: `SELECT * FROM users;`

---

## ✅ Done!

Your app now uses PostgreSQL instead of in-memory storage!

All data persists between server restarts! 🎉

---

## 📖 Detailed Guide

See `POSTGRESQL_SETUP.md` for step-by-step instructions with screenshots and troubleshooting.
