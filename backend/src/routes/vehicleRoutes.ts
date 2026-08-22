import { Router } from "express";
import {
  createVehicle,
  getVehicles
} from "../controllers/vehicleController";

const router = Router();

router.post("/", createVehicle);

router.get("/", getVehicles);

export default router;