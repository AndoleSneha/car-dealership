import { Response } from "express";
import Favorite from "../models/Favorite";
import Vehicle from "../models/Vehicle";
import { AuthRequest } from "../middleware/authMiddleware";

// Add vehicle to favorites
export const addFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const vehicleId = req.params.vehicleId as string;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    const existingFavorite = await Favorite.findOne({
      user: userId,
      vehicle: vehicleId,
    });

    if (existingFavorite) {
      res.status(400).json({
        message: "Vehicle already in favorites",
      });
      return;
    }

    const favorite = await Favorite.create({
      user: userId,
      vehicle: vehicleId,
    });

    res.status(201).json({
      message: "Vehicle added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get logged-in user's favorites
export const getFavorites = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const favorites = await Favorite.find({
      user: userId,
    }).populate("vehicle");

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Remove vehicle from favorites
export const removeFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const vehicleId = req.params.vehicleId as string;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      vehicle: vehicleId,
    });

    if (!favorite) {
      res.status(404).json({
        message: "Favorite not found",
      });
      return;
    }

    res.status(200).json({
      message: "Vehicle removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};