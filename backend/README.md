# B2B Backend API

Complete REST API for the B2B Invoice Management System built with Node.js and Express.

## Features

- ✅ **RESTful API** with Express.js
- ✅ **JWT Authentication** for secure access
- ✅ **In-Memory Database** (easily replaceable with any database)
- ✅ **CRUD Operations** for Customers, Invoices, and Payments
- ✅ **Error Handling** with custom middleware
- ✅ **CORS Enabled** for frontend integration
- ✅ **Password Hashing** with bcryptjs

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4028
FRONTEND_URLS=http://localhost:4028,http://localhost:5173
BACKEND_URL=http://localhost:5000

# JWT Secret - Generate a strong random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=your-postgres-password-here

# Google OAuth (Required for Google login)
# See GOOGLE_OAUTH_SETUP.md for setup instructions
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Note:** For Google OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md)

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Customers

- `GET /api/customers` - Get all customers (Protected)
- `GET /api/customers/:id` - Get customer by ID (Protected)
- `POST /api/customers` - Create new customer (Protected)
- `PUT /api/customers/:id` - Update customer (Protected)
- `DELETE /api/customers/:id` - Delete customer (Protected)

### Invoices

- `GET /api/invoices` - Get all invoices (Protected)
- `GET /api/invoices/:id` - Get invoice by ID (Protected)
- `POST /api/invoices` - Create new invoice (Protected)
- `PUT /api/invoices/:id` - Update invoice (Protected)
- `DELETE /api/invoices/:id` - Delete invoice (Protected)

### Payments

- `GET /api/payments` - Get all payments (Protected)
- `GET /api/payments/:id` - Get payment by ID (Protected)
- `POST /api/payments` - Record new payment (Protected)
- `GET /api/payments/invoice/:invoiceId` - Get payments by invoice (Protected)

### Health Check

- `GET /api/health` - Server health check

## Database Integration

The backend currently uses an **in-memory database** for easy setup. To integrate a real database:

### 1. Supabase (PostgreSQL)

```bash
npm install @supabase/supabase-js
```

Update `services/database.service.js` to use Supabase client.

### 2. MongoDB

```bash
npm install mongoose
```

Create models and update database service.

### 3. MySQL/PostgreSQL

```bash
npm install mysql2 sequelize
# OR
npm install pg sequelize
```

Use Sequelize ORM for database operations.

## Project Structure

```
backend/
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── customer.controller.js
│   ├── invoice.controller.js
│   └── payment.controller.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── customer.routes.js
│   ├── invoice.routes.js
│   └── payment.routes.js
├── middleware/         # Custom middleware
│   ├── auth.middleware.js
│   └── errorHandler.js
├── services/          # Business logic
│   └── database.service.js
├── .env              # Environment variables
├── .gitignore
├── package.json
└── server.js         # Entry point
```

## Authentication Flow

1. User registers → Backend hashes password → Returns JWT token
2. User logs in → Backend verifies password → Returns JWT token
3. Frontend stores token in localStorage
4. Protected requests include `Authorization: Bearer <token>` header
5. Backend verifies token and processes request

## Error Handling

All errors are handled by the global error handler:

```javascript
{
  "error": {
    "message": "Error message here",
    "status": 400
  }
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS configuration
- ✅ Request validation
- ✅ Protected routes with auth middleware

## Development Tips

1. Use **Postman** or **Thunder Client** to test APIs
2. Check console logs for debugging
3. Monitor requests in real-time
4. Use `nodemon` for auto-reload during development

## Next Steps

1. **Choose and integrate a database** (Supabase, MongoDB, PostgreSQL, etc.)
2. **Add validation** using express-validator or joi
3. **Add rate limiting** to prevent abuse
4. **Add file upload** for invoice PDFs
5. **Add email notifications** for payments and reminders
6. **Add tests** using Jest or Mocha
7. **Deploy to production** (Heroku, Railway, AWS, etc.)

## Support

For issues or questions, check the main README.md in the root directory.
