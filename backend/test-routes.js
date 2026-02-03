import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Test if routes are loading
console.log('Testing route imports...');

try {
  const authRoutes = await import('./routes/auth.routes.js');
  console.log('✅ Auth routes loaded:', authRoutes);

  app.use('/api/auth', authRoutes.default);

  // List all registered routes
  console.log('\n📋 Registered routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`  ${Object.keys(handler.route.methods)} ${handler.route.path}`);
        }
      });
    }
  });
} catch (error) {
  console.error('❌ Error loading routes:', error);
}
