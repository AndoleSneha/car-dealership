# 🚗 Car Dealership Management System

A full-stack car dealership management application built with React, TypeScript, Node.js, Express, MongoDB, and JWT authentication.

The application provides separate functionality for customers and administrators, including vehicle browsing, filtering, purchasing, inventory management, and role-based access control.

---

## ✨ Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse available vehicles
- Search vehicles by make or model
- Filter vehicles by category
- Filter vehicles by maximum price
- Purchase vehicles
- Real-time quantity updates after purchase
- Stock availability indicators
- Logout functionality

### 👑 Admin Features

- Secure admin authentication
- Role-based Admin Dashboard
- View dealership inventory
- Add new vehicles
- Restock vehicles
- Delete vehicles
- View updated inventory quantities
- Return to customer vehicle view

### 🔐 Security

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Protected vehicle operations
- Environment variables for sensitive configuration
- `.env` excluded from Git

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

### Testing

- Jest
- Supertest

---

## 🏗️ Project Architecture

```text
car-dealership/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── AdminDashboard.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── .gitignore
🔄 Application Flow
User
 │
 ▼
React Frontend
 │
 │ HTTP Requests
 ▼
Express REST API
 │
 ├── Authentication
 │     ├── Register
 │     └── Login
 │
 ├── Vehicle Operations
 │     ├── Get Vehicles
 │     ├── Purchase
 │     ├── Add Vehicle
 │     ├── Restock
 │     └── Delete
 │
 ▼
MongoDB
🔑 Authentication Flow
User Login
    │
    ▼
Express API
    │
    ▼
MongoDB
    │
    ▼
bcrypt Password Verification
    │
    ▼
JWT Token
    │
    ▼
React Frontend
    │
    ▼
Role Detection
    │
 ┌──┴───────────┐
 ▼              ▼
User          Admin
 │              │
 ▼              ▼
Vehicles    Admin Dashboard
📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
Vehicles
Method	Endpoint	Description
GET	/api/vehicles	Get available vehicles
POST	/api/vehicles	Add a vehicle
POST	/api/vehicles/:id/purchase	Purchase a vehicle
PATCH	/api/vehicles/:id/restock	Restock vehicle
DELETE	/api/vehicles/:id	Delete vehicle

Admin-only operations require a valid JWT with the admin role.

⚙️ Installation
1. Clone the repository
git clone https://github.com/AndoleSneha/car-dealership.git
cd car-dealership
2. Backend setup
cd backend
npm install

Create a .env file based on .env.example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000
3. Frontend setup

Open another terminal:

cd frontend
npm install
npm run dev

The frontend runs on:

http://localhost:5173
🧪 Testing

The backend includes automated tests using Jest and Supertest.

Run all tests:

npm test -- --runInBand

Run tests with coverage:

npx jest --coverage --runInBand
Current Test Results
Test Suites: 2 passed
Tests:       36 passed
Coverage
Statements: 85.59%
Branches:   92.68%
Functions:  92.30%
Lines:      84.88%
🏗️ Production Build
Frontend
cd frontend
npm run build

The production build is generated in:

frontend/dist/
🔒 Environment Variables

Never commit the real .env file.

Use:

backend/.env.example

as the template.

Required variables:

MONGO_URI=
JWT_SECRET=
PORT=5000
📸 Application
Customer Vehicle Page

The application provides a clean vehicle browsing interface with:

Search
Category filtering
Maximum price filtering
Stock information
Purchase functionality
Admin Dashboard

Administrators can manage dealership inventory through:

Add Vehicle
Restock
Delete Vehicle
Inventory management
🎯 Future Improvements

Possible future enhancements include:

Vehicle images
Pagination
User purchase history
Admin analytics dashboard
Advanced vehicle sorting
Payment integration
Cloud deployment
Email notifications
Vehicle favorites/wishlist
👩‍💻 Author

Sneha Andole

GitHub:

https://github.com/AndoleSneha

📄 License

This project is created for educational and portfolio purposes.