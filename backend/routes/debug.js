import express from 'express';
const router = express.Router();

export default (pool) => {
  // View all tables and their row counts
  router.get('/tables', async (req, res) => {
    try {
      const query = `
        SELECT
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `;

      const result = await pool.query(query);

      // Get row counts for each table
      const tablesWithCounts = await Promise.all(
        result.rows.map(async (table) => {
          try {
            const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
            return {
              table_name: table.table_name,
              column_count: table.column_count,
              row_count: parseInt(countResult.rows[0].count)
            };
          } catch (err) {
            return {
              table_name: table.table_name,
              column_count: table.column_count,
              row_count: 0,
              error: err.message
            };
          }
        })
      );

      res.json({ tables: tablesWithCounts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // View all data
  router.get('/data', async (req, res) => {
    try {
      const [users, customers, invoices, payments] = await Promise.all([
        pool.query('SELECT id, email, created_at FROM users ORDER BY id'),
        pool.query('SELECT * FROM customers ORDER BY id'),
        pool.query('SELECT * FROM invoices ORDER BY id'),
        pool.query('SELECT * FROM payments ORDER BY id')
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

      const result = await pool.query(query);

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

      const result = await pool.query(sql);
      res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
