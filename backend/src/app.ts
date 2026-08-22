import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Car Dealership API is running"
  });
});

app.use("/api/auth", authRoutes);

export default app;