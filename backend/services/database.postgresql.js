import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

class PostgreSQLDatabase {
  constructor() {
    const password = process.env.DB_PASSWORD || '';

    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'b2b_creditflow',
      user: process.env.DB_USER || 'postgres',
      password: password,
    });

    this.pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    this.pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });
  }

  // Helper function to convert database row to camelCase
  mapUserFromDB(row) {
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      fullName: row.full_name,
      businessName: row.business_name,
      companyName: row.business_name, // Alias for frontend compatibility
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // USER OPERATIONS
  async createUser(userData) {
    const query = `
      INSERT INTO users (email, password, full_name, business_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      userData.email,
      userData.password,
      userData.fullName,
      userData.businessName,
      userData.phone
    ];
    const result = await this.pool.query(query, values);
    return this.mapUserFromDB(result.rows[0]);
  }

  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return this.mapUserFromDB(result.rows[0]);
  }

  async findUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return this.mapUserFromDB(result.rows[0]);
  }

  // Helper function to map customer from DB
  mapCustomerFromDB(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      gst: row.gst,
      address: row.address,
      creditLimit: row.credit_limit,
      paymentTerms: row.payment_terms,
      riskScore: row.risk_score,
      outstanding: row.outstanding,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Helper function to map invoice from DB
  mapInvoiceFromDB(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      invoiceNumber: row.invoice_number,
      amount: row.amount,
      paidAmount: row.paid_amount,
      dueDate: row.due_date,
      status: row.status,
      items: row.items,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Helper function to map payment from DB
  mapPaymentFromDB(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      invoiceId: row.invoice_id,
      invoiceNumber: row.invoice_number,
      customerId: row.customer_id,
      customerName: row.customer_name,
      amount: row.amount,
      paymentDate: row.payment_date,
      paymentMethod: row.payment_method,
      reference: row.reference,
      notes: row.notes,
      createdAt: row.created_at
    };
  }

  // CUSTOMER OPERATIONS
  async createCustomer(userId, customerData) {
    const query = `
      INSERT INTO customers (user_id, name, email, phone, gst, address, credit_limit, payment_terms, risk_score, outstanding)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      userId,
      customerData.name,
      customerData.email,
      customerData.phone,
      customerData.gst,
      customerData.address,
      customerData.creditLimit || 0,
      customerData.paymentTerms || 30,
      customerData.riskScore || 'low',
      customerData.outstanding || 0
    ];
    const result = await this.pool.query(query, values);
    return this.mapCustomerFromDB(result.rows[0]);
  }

  async getCustomersByUserId(userId) {
    const query = 'SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapCustomerFromDB(row));
  }

  async getCustomerById(id, userId) {
    const query = 'SELECT * FROM customers WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return this.mapCustomerFromDB(result.rows[0]);
  }

  async updateCustomer(id, userId, updates) {
    const fields = [];
    const values = [];
    let valueIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        // Convert camelCase to snake_case
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${valueIndex}`);
        values.push(updates[key]);
        valueIndex++;
      }
    });

    values.push(id);
    values.push(userId);

    const query = `
      UPDATE customers
      SET ${fields.join(', ')}
      WHERE id = $${valueIndex} AND user_id = $${valueIndex + 1}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return this.mapCustomerFromDB(result.rows[0]);
  }

  async deleteCustomer(id, userId) {
    const query = 'DELETE FROM customers WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  // INVOICE OPERATIONS
  async createInvoice(userId, invoiceData) {
    const query = `
      INSERT INTO invoices (user_id, customer_id, invoice_number, customer_name, amount, due_date, status, paid_amount, items, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      userId,
      invoiceData.customerId,
      invoiceData.invoiceNumber,
      invoiceData.customerName,
      invoiceData.amount,
      invoiceData.dueDate,
      invoiceData.status || 'pending',
      invoiceData.paidAmount || 0,
      JSON.stringify(invoiceData.items || []),
      invoiceData.notes
    ];
    const result = await this.pool.query(query, values);
    return this.mapInvoiceFromDB(result.rows[0]);
  }

  async getInvoicesByUserId(userId) {
    const query = 'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapInvoiceFromDB(row));
  }

  async getInvoiceById(id, userId) {
    const query = 'SELECT * FROM invoices WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return this.mapInvoiceFromDB(result.rows[0]);
  }

  async updateInvoice(id, userId, updates) {
    const fields = [];
    const values = [];
    let valueIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        // Convert camelCase to snake_case
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (key === 'items') {
          fields.push(`${dbKey} = $${valueIndex}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${dbKey} = $${valueIndex}`);
          values.push(updates[key]);
        }
        valueIndex++;
      }
    });

    values.push(id);
    values.push(userId);

    const query = `
      UPDATE invoices
      SET ${fields.join(', ')}
      WHERE id = $${valueIndex} AND user_id = $${valueIndex + 1}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return this.mapInvoiceFromDB(result.rows[0]);
  }

  async deleteInvoice(id, userId) {
    const query = 'DELETE FROM invoices WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  // PAYMENT OPERATIONS
  async createPayment(userId, paymentData) {
    const query = `
      INSERT INTO payments (user_id, invoice_id, customer_id, invoice_number, customer_name, amount, payment_date, payment_method, reference, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      userId,
      paymentData.invoiceId,
      paymentData.customerId,
      paymentData.invoiceNumber,
      paymentData.customerName,
      paymentData.amount,
      paymentData.paymentDate,
      paymentData.paymentMethod || 'bank_transfer',
      paymentData.reference,
      paymentData.notes
    ];
    const result = await this.pool.query(query, values);
    return this.mapPaymentFromDB(result.rows[0]);
  }

  async getPaymentsByUserId(userId) {
    const query = 'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapPaymentFromDB(row));
  }

  async getPaymentsByInvoiceId(invoiceId, userId) {
    const query = 'SELECT * FROM payments WHERE invoice_id = $1 AND user_id = $2 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [invoiceId, userId]);
    return result.rows.map(row => this.mapPaymentFromDB(row));
  }

  async getPaymentById(id, userId) {
    const query = 'SELECT * FROM payments WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [id, userId]);
    return this.mapPaymentFromDB(result.rows[0]);
  }

  // Test connection
  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('✅ Database connection successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  // Close connection pool
  async close() {
    await this.pool.end();
  }
}

// Export singleton instance
export const db = new PostgreSQLDatabase();
