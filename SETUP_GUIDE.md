# 🚀 Complete Setup Guide - B2B Invoice Management System

## ✅ Backend + Frontend Integration Complete!

Your B2B application now has a **complete backend** with REST APIs and JWT authentication. All frontend components have been updated to communicate with the backend.

---

## 📁 Project Structure

```
B2B/
├── backend/                 # Node.js Backend API
│   ├── controllers/         # API Controllers
│   ├── routes/              # API Routes
│   ├── middleware/          # Auth & Error Handling
│   ├── services/            # Database Service
│   ├── server.js            # Main Server File
│   ├── package.json
│   └── README.md
│
├── src/                     # React Frontend
│   ├── services/
│   │   └── api.js          # ✅ Backend API Integration
│   ├── context/
│   │   ├── UserContext.jsx  # ✅ JWT Authentication
│   │   └── DataContext.jsx  # ✅ API-based Data
│   ├── pages/
│   │   └── auth/
│   │       ├── Login.jsx    # ✅ Updated
│   │       └── Register.jsx # ✅ Updated
│   └── ...
│
├── .env                     # Frontend Config
├── package.json
└── README.md
```

---

## 🎯 Quick Start Instructions

### **Step 1: Install Backend Dependencies**

```bash
cd backend
npm install
```

### **Step 2: Start Backend Server**

```bash
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

**Backend will run on:** http://localhost:5000

### **Step 3: Install Frontend Dependencies (if not done)**

```bash
cd ..
npm install
```

### **Step 4: Start Frontend**

```bash
npm run dev
```

**Frontend will run on:** http://localhost:5173

---

## 🔑 Features Implemented

### Backend

- ✅ **JWT Authentication** (Login/Register)
- ✅ **Customer Management** (CRUD)
- ✅ **Invoice Management** (CRUD)
- ✅ **Payment Recording** (CRUD)
- ✅ **Password Hashing** (bcryptjs)
- ✅ **Error Handling** Middleware
- ✅ **CORS Enabled**
- ✅ **In-Memory Database** (easily replaceable)

### Frontend

- ✅ **API Service Layer** (`src/services/api.js`)
- ✅ **JWT Token Storage**
- ✅ **Protected Routes**
- ✅ **Real Authentication**
- ✅ **Backend Integration**

---

## 🗄️ Database Options

Currently using **in-memory storage** (data resets on server restart). Choose your database:

### Option 1: Supabase (Recommended - PostgreSQL)

```bash
cd backend
npm install @supabase/supabase-js
```

**Pros:**

- Free tier available
- PostgreSQL database
- Built-in authentication
- Real-time capabilities
- File storage included

**Setup:**

1. Create account at https://supabase.com
2. Create new project
3. Get API URL and keys
4. Update `backend/.env`:

```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

5. Update `backend/services/database.service.js` to use Supabase

### Option 2: MongoDB Atlas

```bash
cd backend
npm install mongoose
```

**Pros:**

- NoSQL flexibility
- Free tier (512MB)
- Cloud-hosted
- Easy scaling

**Setup:**

1. Create account at https://mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `backend/.env`:

```env
MONGODB_URI=your-connection-string
```

### Option 3: PostgreSQL (Neon, Railway, etc.)

```bash
cd backend
npm install pg sequelize
```

### Option 4: MySQL

```bash
cd backend
npm install mysql2 sequelize
```

---

## 🧪 Testing the Application

### Test Backend API:

**1. Health Check:**

```bash
curl http://localhost:5000/api/health
```

**2. Register User:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "businessName": "Test Business"
  }'
```

**3. Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend:

1. Open http://localhost:5173
2. Click "Create Account"
3. Fill registration form
4. Submit and login
5. Test customer/invoice/payment features

---

## 🔐 Environment Variables

### Frontend (`.env` in root):

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`):

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 📡 API Endpoints Summary

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Customers

- `GET /api/customers` - Get all (Protected)
- `POST /api/customers` - Create (Protected)
- `PUT /api/customers/:id` - Update (Protected)
- `DELETE /api/customers/:id` - Delete (Protected)

### Invoices

- `GET /api/invoices` - Get all (Protected)
- `POST /api/invoices` - Create (Protected)
- `PUT /api/invoices/:id` - Update (Protected)
- `DELETE /api/invoices/:id` - Delete (Protected)

### Payments

- `GET /api/payments` - Get all (Protected)
- `POST /api/payments` - Create (Protected)
- `GET /api/payments/invoice/:invoiceId` - Get by invoice (Protected)

---

## 🚀 Next Steps

Now that backend is complete, you can:

1. **Choose and integrate a database** (see options above)
2. **Test all features** (registration, login, CRUD operations)
3. **Add email notifications** (SendGrid, Nodemailer)
4. **Add SMS reminders** (Twilio)
5. **Deploy backend** (Heroku, Railway, Render, AWS)
6. **Deploy frontend** (Vercel, Netlify)
7. **Add API documentation** (Swagger/OpenAPI)
8. **Add unit tests** (Jest, Mocha)

---

## 🐛 Troubleshooting

### Backend won't start:

```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### CORS errors:

- Check `FRONTEND_URL` in `backend/.env`
- Ensure it matches your frontend URL

### Authentication errors:

- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token in browser DevTools

### Can't connect to backend:

- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Look for errors in backend console

---

## 📚 Documentation

- **Backend API:** See `backend/README.md`
- **Frontend:** See main `README.md`

---

## 🎉 You're All Set!

Your B2B Invoice Management System now has:

- ✅ Complete backend with REST APIs
- ✅ JWT-based authentication
- ✅ Full CRUD operations
- ✅ Frontend-backend integration
- ✅ Ready for database integration

**Next:** Choose your database and integrate it!
