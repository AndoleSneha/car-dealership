import dotenv from "dotenv";
import express from "express";

import cors from "cors";
import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Car Dealership API is running"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

export default app;