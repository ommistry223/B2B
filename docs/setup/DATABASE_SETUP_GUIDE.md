# PostgreSQL Database Setup Guide

## Step 1: Install PostgreSQL

### Download PostgreSQL:

1. Go to: https://www.postgresql.org/download/windows/
2. Download the **PostgreSQL 16** installer
3. Run the installer

### During Installation:

- **Password**: Set a password for PostgreSQL (remember this!)
- **Port**: Keep default **5432**
- **Locale**: Default
- **Components**: Select all (including pgAdmin 4)

---

## Step 2: Open pgAdmin 4

1. Search "pgAdmin 4" in Windows Start Menu
2. Open it (it will open in your browser)
3. Enter your master password (if asked)

---

## Step 3: Create Database

### In pgAdmin:

1. **Expand** "Servers" → "PostgreSQL 16"
2. **Right-click** on "Databases"
3. Click **"Create" → "Database"**
4. **Database name**: `b2b_creditflow`
5. **Owner**: postgres
6. Click **"Save"**

---

## Step 4: Create Tables

1. **Expand** your new database `b2b_creditflow`
2. **Right-click** on `b2b_creditflow`
3. Click **"Query Tool"**
4. Copy and paste the SQL below
5. Click **"Execute"** (Play button) or press **F5**

### SQL Script:

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

-- Create indexes for better performance
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

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Step 5: Verify Tables Created

1. In pgAdmin, **refresh** the database
2. Expand: `b2b_creditflow` → `Schemas` → `public` → `Tables`
3. You should see:
   - ✅ users
   - ✅ customers
   - ✅ invoices
   - ✅ payments

---

## Step 6: Get Database Connection Info

You'll need these details (note them down):

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `b2b_creditflow`
- **User**: `postgres`
- **Password**: (the password you set during installation)

---

## Step 7: Install PostgreSQL Package in Backend

Open terminal and run:

```bash
cd backend
npm install pg
```

---

## Step 8: Update Backend .env File

Edit `backend/.env` and add:

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
```

---

## Step 9: Test Connection

I'll provide a test script to verify the connection works.

---

## Troubleshooting

### Cannot connect to PostgreSQL:

1. Make sure PostgreSQL service is running
2. Check Windows Services → "postgresql-x64-16" should be "Running"
3. Verify password is correct

### Port 5432 already in use:

1. Check if another database is running
2. Change port in both PostgreSQL and .env file

### pgAdmin won't open:

1. Check if it's running on http://localhost:5050 or similar
2. Restart pgAdmin

---

After completing these steps, proceed to update the backend code!
