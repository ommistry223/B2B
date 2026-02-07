import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import customerRoutes from './routes/customer.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import importRoutes from './routes/import.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db } from './services/database.postgresql.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy headers (Railway/Render/Netlify)
app.set('trust proxy', 1);

// Enhanced CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow Netlify domains and localhost
    const allowedOrigins = [
      'https://bto-b.netlify.app',
      'https://b2b.netlify.app',
      'http://localhost:5173',
      'http://localhost:4028',
      'http://localhost:3000'
    ];

    // Allow any Netlify deploy preview (*.netlify.app)
    if (origin.endsWith('.netlify.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, true); // Allow anyway but log warning
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/import', importRoutes);

// Debug routes - view database contents
import debugRoutes from './routes/debug.js';
app.use('/api/debug', debugRoutes(db.pool));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'B2B Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection test
const testDatabaseConnection = async () => {
  try {
    await db.pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('⚠️ Warning: Server starting without database connection');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Configured' : '⚠️ MISSING!'}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
