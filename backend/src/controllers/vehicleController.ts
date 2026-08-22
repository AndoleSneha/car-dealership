import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

export const createVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      make,
      model,
      category,
      price,
      quantity
    } = req.body;

    if (
      !make ||
      !model ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      res.status(400).json({
        message:
          "Make, model, category, price and quantity are required"
      });
      return;
    }

    if (price < 0 || quantity < 0) {
      res.status(400).json({
        message: "Price and quantity cannot be negative"
      });
      return;
    }

    const vehicle = await Vehicle.create({
      make,
      model,
      category,
      price,
      quantity
    });

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle
    });
  } catch (error) {
    console.error("Vehicle creation error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const getVehicles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicles = await Vehicle.find({
      quantity: { $gt: 0 }
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      vehicles
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const searchVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      make,
      model,
      category,
      minPrice,
      maxPrice
    } = req.query;

    const filter: any = {
      quantity: { $gt: 0 }
    };

    if (make) {
      filter.make = {
        $regex: make as string,
        $options: "i"
      };
    }

    if (model) {
      filter.model = {
        $regex: model as string,
        $options: "i"
      };
    }

    if (category) {
      filter.category = {
        $regex: category as string,
        $options: "i"
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const vehicles = await Vehicle.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      vehicles
    });
  } catch (error) {
    console.error("Search vehicles error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};