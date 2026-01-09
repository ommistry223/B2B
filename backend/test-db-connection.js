import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { db } from './services/database.postgresql.js';

async function testDatabaseConnection() {
  console.log('🧪 Testing PostgreSQL Database Connection...\n');

  console.log('Configuration:');
  console.log('- Host:', process.env.DB_HOST || 'localhost');
  console.log('- Port:', process.env.DB_PORT || '5432');
  console.log('- Database:', process.env.DB_NAME || 'b2b_creditflow');
  console.log('- User:', process.env.DB_USER || 'postgres');
  console.log('- Password:', process.env.DB_PASSWORD ? '***hidden***' : '⚠️  NOT SET');
  console.log('\n');

  const isConnected = await db.testConnection();

  if (isConnected) {
    console.log('\n✅ SUCCESS! Database is connected and working.');
    console.log('\nYou can now:');
    console.log('1. Update server.js to use PostgreSQL');
    console.log('2. Start the server with: npm start');
  } else {
    console.log('\n❌ FAILED! Could not connect to database.');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Verify your password in backend/.env');
    console.log('3. Check if database "b2b_creditflow" exists in pgAdmin');
    console.log('4. Ensure PostgreSQL service is running in Windows Services');
  }

  await db.close();
  process.exit(0);
}

testDatabaseConnection();
