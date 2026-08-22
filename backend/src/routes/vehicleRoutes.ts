import { Router } from "express";

import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from "../controllers/vehicleController";

import {
  authenticateToken,
  requireAdmin
} from "../middleware/authMiddleware";

const router = Router();

router.post("/", createVehicle);

router.get("/search", searchVehicles);

router.post("/:id/purchase", purchaseVehicle);

router.post(
  "/:id/restock",
  authenticateToken,
  requireAdmin,
  restockVehicle
);

router.put("/:id", updateVehicle);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteVehicle
);

router.get("/", getVehicles);

export default router;