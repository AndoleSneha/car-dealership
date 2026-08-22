import { Router } from "express";

import {
  createVehicle,
  getVehicles,
  searchVehicles
} from "../controllers/vehicleController";

const router = Router();

router.post("/", createVehicle);

router.get("/search", searchVehicles);

router.get("/", getVehicles);

export default router;