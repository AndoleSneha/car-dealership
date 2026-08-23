import { Router } from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Get logged-in user's favorites
router.get("/", authenticateToken, getFavorites);

// Add a vehicle to favorites
router.post("/:vehicleId", authenticateToken, addFavorite);

// Remove a vehicle from favorites
router.delete("/:vehicleId", authenticateToken, removeFavorite);

export default router;