import { Router } from "express";

import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle
} from "../controllers/vehicleController";

const router = Router();

router.post("/", createVehicle);

router.get("/search", searchVehicles);

router.put("/:id", updateVehicle);

router.get("/", getVehicles);

export default router;