# 🚗 Car Dealership Management System

A full-stack **Car Dealership Management System** built using React, TypeScript, Node.js, Express, MongoDB, and JWT authentication.

The application provides separate experiences for **customers and administrators**, allowing customers to browse and favorite vehicles while administrators can manage the dealership inventory through a dedicated dashboard.

---

## ✨ Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse available vehicles
- Search vehicles by make or model
- Filter vehicles by category
- Filter vehicles by maximum price
- View vehicle images
- View vehicle price and availability
- Stock availability indicators
- Purchase vehicles
- Real-time quantity updates after purchase
- Add vehicles to favorites
- Remove vehicles from favorites
- Dedicated Favorites page
- Logout functionality

---

### 👑 Admin Features

- Secure admin authentication
- Role-based access control
- Dedicated Admin Dashboard
- View complete dealership inventory
- Add new vehicles
- Edit existing vehicles
- Update vehicle information
- Add vehicle images using image URLs
- Restock vehicles
- Delete vehicles
- View updated inventory quantities
- Manage vehicle pricing
- Manage vehicle categories
- Manage vehicle availability
- Return to customer vehicle view

---

### ❤️ Favorites / Wishlist

Customers can save vehicles for later using the Favorites feature.

Features include:

- Add a vehicle to favorites
- Remove a vehicle from favorites
- View all favorite vehicles
- Favorites are associated with the authenticated user
- Favorite state is maintained across sessions using JWT authentication

---

### 🖼️ Vehicle Images

Each vehicle supports an image URL.

Vehicle images are displayed in:

- Customer Vehicle Page
- Favorites Page
- Admin Dashboard

If an image cannot be loaded, the application displays a fallback vehicle icon.

---

### 🔐 Security

- Password hashing using `bcrypt`
- JWT-based authentication
- Role-based authorization
- Protected admin operations
- Protected favorite operations
- Protected vehicle management operations
- Environment variables for sensitive configuration
- `.env` excluded from Git

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

## Testing

- Jest
- Supertest

## Deployment

- Render
- MongoDB Atlas
- GitHub

---

# 🏗️ Project Architecture

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
│   │   │   ├── Home.tsx
│   │   │   └── Favorites.tsx
│   │   │
│   │   ├── assets/
│   │   ├── AdminDashboard.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
🔄 Application Flow
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             │
                       HTTP Requests
                             │
                             ▼
                    ┌─────────────────┐
                    │  Express REST   │
                    │      API        │
                    └────────┬────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
      Authentication     Vehicles         Favorites
             │               │                │
             └───────────────┼────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    └─────────────────┘
🔑 Authentication Flow
User Registration / Login
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
   React Local Storage
          │
          ▼
     Role Detection
          │
      ┌───┴────┐
      ▼        ▼
    User      Admin
      │        │
      ▼        ▼
  Vehicles   Dashboard
🚘 Vehicle Management Flow
Customer
Browse Vehicles
      │
      ├── Search
      ├── Category Filter
      ├── Price Filter
      ├── View Details
      ├── Add Favorite
      └── Purchase
Administrator
Admin Dashboard
      │
      ├── Add Vehicle
      ├── Edit Vehicle
      ├── Restock Vehicle
      ├── Delete Vehicle
      └── View Inventory
📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
Vehicles
Method	Endpoint	Description
GET	/api/vehicles	Get available vehicles
GET	/api/vehicles/search	Search/filter vehicles
POST	/api/vehicles	Add a new vehicle
PATCH	/api/vehicles/:id	Update a vehicle
POST	/api/vehicles/:id/purchase	Purchase a vehicle
PATCH	/api/vehicles/:id/restock	Restock a vehicle
DELETE	/api/vehicles/:id	Delete a vehicle

Admin-only vehicle management operations require a valid JWT with the admin role.

❤️ Favorites
Method	Endpoint	Description
GET	/api/favorites	Get user's favorites
POST	/api/favorites/:vehicleId	Add vehicle to favorites
DELETE	/api/favorites/:vehicleId	Remove vehicle from favorites

Favorite operations require a valid JWT.

⚙️ Installation
1. Clone the Repository
git clone https://github.com/AndoleSneha/car-dealership.git
cd car-dealership
2. Backend Setup
cd backend
npm install

Create a .env file based on .env.example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Start the backend:

npm run dev

The backend runs locally on:

http://localhost:5000
3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

The frontend runs locally on:

http://localhost:5173


# 🌐🚀 LIVE DEPLOYMENT

### 🔗 Live Application
👉 **https://car-dealership-frontend-gr3c.onrender.com**

### 🔗 Backend API
👉 **https://car-dealership-backend-wd20.onrender.com**

The application is fully deployed and accessible online.

- **Frontend:** React + TypeScript + Vite → deployed on Render
- **Backend:** Node.js + Express + TypeScript → deployed on Render
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **API Communication:** REST API using Axios

### 🚀 Try the Application

**Customer:**  
Visit the live application and register/login to browse vehicles, search, filter, purchase, and add vehicles to favorites.

**Admin:**  
Login with an authorized admin account to access the Admin Dashboard and manage the vehicle inventory.



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

The .env file is excluded from Git using .gitignore.

📸 Application
Customer Vehicle Page

The customer interface provides:

Vehicle browsing
Vehicle images
Search by make/model
Category filtering
Maximum price filtering
Price display
Stock information
Favorites
Purchase functionality
Responsive vehicle cards
❤️ Favorites Page

Customers can:

View saved vehicles
Remove vehicles from favorites
Return to the vehicle browsing page
View vehicle images, price, category and availability
👑 Admin Dashboard

Administrators can manage dealership inventory through:

Add Vehicle
Edit Vehicle
Update vehicle information
Vehicle image management
Restock
Delete
Inventory quantity management
Vehicle price management
Vehicle category management

The dashboard uses organized vehicle cards for easier inventory management.

📊 Vehicle Information

Each vehicle contains:

Vehicle
│
├── Make
├── Model
├── Year
├── Category
├── Price
├── Quantity
└── Image URL
🎯 Future Improvements

Possible future enhancements include:

Pagination
User purchase history
Admin analytics dashboard
Advanced vehicle sorting
Payment integration
Email notifications
Vehicle comparison
Advanced vehicle details page
Cloud image storage
Order management
Customer reviews and ratings
Sales analytics
Admin inventory statistics
👩‍💻 Author

Sneha Andole

GitHub:

https://github.com/AndoleSneha

📄 License

This project is created for educational and portfolio purposes.
