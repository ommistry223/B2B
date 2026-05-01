# 🎯 Complete PostgreSQL Setup Instructions

Follow these steps **IN ORDER** to connect PostgreSQL to your project.

---

## ✅ STEP 1: Install PostgreSQL

### Download:

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Choose **PostgreSQL 16** (Windows x86-64)
4. Run the downloaded `.exe` file

### Installation Settings:

- ✅ **Installation Directory**: Default (C:\Program Files\PostgreSQL\16)
- ✅ **Components**: Select ALL (PostgreSQL Server, pgAdmin 4, Command Line Tools)
- ✅ **Data Directory**: Default
- ✅ **Password**: Set a strong password (IMPORTANT: Remember this!)
- ✅ **Port**: 5432 (default)
- ✅ **Locale**: Default

### After Installation:

- PostgreSQL should auto-start
- pgAdmin 4 will be installed

---

## ✅ STEP 2: Open pgAdmin 4

1. Press **Windows Key**
2. Type: **pgAdmin 4**
3. Click to open (it opens in your browser)
4. Set a **Master Password** (if asked)
5. You should see "Servers" on the left sidebar

---

## ✅ STEP 3: Connect to PostgreSQL Server

1. In pgAdmin, click on **"Servers"** in left panel
2. Click on **"PostgreSQL 16"**
3. Enter the **password** you set during installation
4. Click **"OK"**
5. You should see the server expand with:
   - Databases
   - Login/Group Roles
   - Tablespaces

---

## ✅ STEP 4: Create Database

### Method 1: Using pgAdmin GUI:

1. Right-click on **"Databases"**
2. Select **"Create" → "Database..."**
3. **Database name**: `b2b_creditflow`
4. **Owner**: `postgres`
5. Click **"Save"**

### Method 2: Using SQL:

1. Right-click on "PostgreSQL 16"
2. Click "Query Tool"
3. Paste: `CREATE DATABASE b2b_creditflow;`
4. Click **Execute** (⚡ icon) or press **F5**

---

## ✅ STEP 5: Create Tables

1. **Expand** `b2b_creditflow` database in left panel
2. **Right-click** on `b2b_creditflow`
3. Click **"Query Tool"**
4. **Copy the ENTIRE SQL script below**
5. **Paste** in Query Tool
6. Click **Execute** (⚡ icon) or press **F5**

### 📝 SQL Script (Copy Everything):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    business_name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    gst VARCHAR(50),
    address TEXT,
    credit_limit DECIMAL(15, 2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30,
    risk_score VARCHAR(50) DEFAULT 'low',
    outstanding DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    items JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100),
    customer_name VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### ✅ Verify Tables:

After executing, you should see: **"Query returned successfully"**

To verify tables were created:

1. **Refresh** the database in left panel (right-click → Refresh)
2. Expand: `b2b_creditflow` → `Schemas` → `public` → `Tables`
3. You should see 4 tables:
   - ✅ customers
   - ✅ invoices
   - ✅ payments
   - ✅ users

---

## ✅ STEP 6: Install PostgreSQL Package

Open **PowerShell** in VS Code:

```bash
cd backend
npm install pg
```

Wait for installation to complete.

---

## ✅ STEP 7: Update backend/.env File

Open: `backend/.env`

Find the PostgreSQL section and **update the password**:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE  # ⚠️ CHANGE THIS!
```

**IMPORTANT:** Replace `YOUR_ACTUAL_PASSWORD_HERE` with the password you set during PostgreSQL installation!

---

## ✅ STEP 8: Test Database Connection

In PowerShell terminal:

```bash
cd backend
node test-db-connection.js
```

### Expected Output:

```
🧪 Testing PostgreSQL Database Connection...

Configuration:
- Host: localhost
- Port: 5432
- Database: b2b_creditflow
- User: postgres
- Password: ***hidden***

✅ Connected to PostgreSQL database
✅ Database connection successful: { now: 2026-01-09T... }

✅ SUCCESS! Database is connected and working.
```

### If You See Errors:

- ❌ **"password authentication failed"** → Wrong password in `.env`
- ❌ **"database does not exist"** → Create `b2b_creditflow` database in pgAdmin
- ❌ **"ECONNREFUSED"** → PostgreSQL service not running

---

## ✅ STEP 9: Update server.js to Use PostgreSQL

Open: `backend/server.js`

**Change Line 6** from:

```javascript
import { db } from './services/database.service.js'
```

**To:**

```javascript
import { db } from './services/database.postgresql.js'
```

Save the file.

---

## ✅ STEP 10: Restart Backend Server

### Stop the current backend:

Press **Ctrl+C** in the terminal where backend is running

### Start with PostgreSQL:

```bash
cd backend
node server.js
```

### Expected Output:

```
✅ Connected to PostgreSQL database
🚀 Server is running on port 5000
📡 Environment: development
🌐 Frontend URL: http://localhost:4028
```

---

## ✅ STEP 11: Test the Application

1. **Open**: http://localhost:4028
2. **Register** a new account (previous accounts won't work - fresh database)
3. **Login** with your new account
4. **Add customers** - they'll be saved to PostgreSQL!
5. **Create invoices**
6. **Record payments**

### Verify Data in pgAdmin:

1. Right-click on `b2b_creditflow` → Query Tool
2. Run: `SELECT * FROM users;`
3. You should see your registered user!
4. Run: `SELECT * FROM customers;`
5. You should see any customers you added!

---

## 🎉 Congratulations!

Your application is now using PostgreSQL database!

### Benefits:

- ✅ Data persists even after server restart
- ✅ Production-ready database
- ✅ Can handle thousands of records
- ✅ Better performance
- ✅ Real relationships between tables
- ✅ Transaction support

---

## 🔧 Troubleshooting

### PostgreSQL Service Not Running:

1. Press **Windows + R**
2. Type: `services.msc`
3. Find: **postgresql-x64-16**
4. Right-click → **Start**

### Cannot connect from pgAdmin:

1. Server → Right-click → Properties
2. Check Host: `localhost`, Port: `5432`
3. Re-enter password

### "relation does not exist" error:

- Tables not created properly
- Re-run the SQL script from Step 5

### Port 5432 in use:

- Another PostgreSQL instance running
- Change port in both PostgreSQL config and `.env`

---

## 📚 Next Steps

- Learn SQL queries to manage data
- Create database backups
- Set up automated backups
- Configure for production deployment
- Add database migrations

---

**Need Help?** Check the error message and search online, or review the steps above!
