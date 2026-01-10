const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // View all tables and their row counts
  router.get('/tables', async (req, res) => {
    try {
      const query = `
        SELECT
          schemaname,
          tablename,
          (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
        FROM (
          SELECT
            schemaname,
            tablename,
            query_to_xml(format('select count(*) as cnt from %I.%I', schemaname, tablename), false, true, '') as xml_count
          FROM pg_tables
          WHERE schemaname = 'public'
        ) t
        ORDER BY tablename;
      `;

      const result = await db.query(query);
      res.json({ tables: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // View all data
  router.get('/data', async (req, res) => {
    try {
      const [users, customers, invoices, payments] = await Promise.all([
        db.query('SELECT id, email, created_at FROM users ORDER BY id'),
        db.query('SELECT * FROM customers ORDER BY id'),
        db.query('SELECT * FROM invoices ORDER BY id'),
        db.query('SELECT * FROM payments ORDER BY id')
      ]);

      res.json({
        users: users.rows,
        customers: customers.rows,
        invoices: invoices.rows,
        payments: payments.rows,
        summary: {
          totalUsers: users.rows.length,
          totalCustomers: customers.rows.length,
          totalInvoices: invoices.rows.length,
          totalPayments: payments.rows.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  // Check schema
  router.get('/schema', async (req, res) => {
    try {
      const query = `
        SELECT
          table_name,
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `;

      const result = await db.query(query);

      // Group by table
      const schema = {};
      result.rows.forEach(row => {
        if (!schema[row.table_name]) {
          schema[row.table_name] = [];
        }
        schema[row.table_name].push({
          column: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable,
          default: row.column_default
        });
      });

      res.json({ schema });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Run custom query (BE CAREFUL!)
  router.post('/query', async (req, res) => {
    try {
      const { sql } = req.body;

      // Only allow SELECT queries for safety
      if (!sql.trim().toLowerCase().startsWith('select')) {
        return res.status(403).json({ error: 'Only SELECT queries allowed' });
      }

      const result = await db.query(sql);
      res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
