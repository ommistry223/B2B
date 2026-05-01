# B2B CreditFlow Pro - Troubleshooting Guide

## Current Issue
Error: "Route /POST /auth/login: no found"

## Root Cause Analysis
The error message format matches the backend's 404 handler, which means:
1. ✅ Frontend IS connecting to local backend (http://localhost:5000/api)
2. ❌ Backend routes are not responding properly

## Most Likely Causes

### 1. PostgreSQL Database Not Running
**Check if PostgreSQL is running:**
```bash
# Check PostgreSQL service status
sc query postgresql-x64-14
# OR
sc query postgresql-x64-16
```

**Start PostgreSQL if not running:**
```bash
# Start the service
net start postgresql-x64-14
# OR
net start postgresql-x64-16
```

### 2. Database Not Initialized
**Initialize the database tables:**
```bash
cd E:\B2B\backend
node setup-database.js
```

### 3. Backend Server Not Started Properly
**Restart the backend server:**
```bash
cd E:\B2B\backend
node server.js
```

You should see:
```
🚀 Server is running on port 5000
📡 Environment: development
🌐 Frontend URL: http://localhost:4028
```

## Step-by-Step Fix

### Step 1: Check PostgreSQL
Open Command Prompt as Administrator and run:
```bash
sc query postgresql
```

If not running, start it:
```bash
net start postgresql-x64-14
```

### Step 2: Create Database (if doesn't exist)
Open PostgreSQL command line (psql) or pgAdmin and run:
```sql
CREATE DATABASE b2b_creditflow;
```

### Step 3: Initialize Database Tables
```bash
cd E:\B2B\backend
node setup-database.js
```

Expected output:
```
✅ Connected to PostgreSQL database
✅ Users table created
✅ Customers table created
✅ Invoices table created
✅ Payments table created
```

### Step 4: Restart Backend Server
```bash
cd E:\B2B\backend
node server.js
```

### Step 5: Restart Frontend
```bash
cd E:\B2B
npm start
```

### Step 6: Test Login
Open browser: http://localhost:4028
Try to login or register a new account.

## Quick Diagnostic Commands

**Test backend health:**
```bash
curl http://localhost:5000/api/health
```

**Test database connection:**
```bash
cd E:\B2B\backend
node test-db-connection.js
```

**Check if port 5000 is in use:**
```bash
netstat -ano | findstr :5000
```

## Common Errors & Solutions

### Error: "ECONNREFUSED"
- PostgreSQL is not running
- Solution: Start PostgreSQL service

### Error: "database does not exist"
- Database not created
- Solution: Run `CREATE DATABASE b2b_creditflow;`

### Error: "relation does not exist"
- Tables not created
- Solution: Run `node setup-database.js`

### Error: "Port 5000 already in use"
- Another process is using port 5000
- Solution: Kill the process or change port in backend/.env

## Need More Help?

Check the backend terminal for error messages. The server logs will show exactly what's failing.
