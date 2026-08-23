import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";

const app = express();

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (_req, res) => {
  res.json({
    message: "Car Dealership API is running",
  });
});

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// Vehicles
app.use("/api/vehicles", vehicleRoutes);

// Favorites ⭐ IMPORTANT
app.use("/api/favorites", favoriteRoutes);

// ===============================
// EXPORT APP
// ===============================
export default app;