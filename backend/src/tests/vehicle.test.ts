import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../app";
import connectDB from "../config/db";
import Vehicle from "../models/Vehicle";

describe("Vehicle Management", () => {
  let vehicleId: string;

  beforeAll(async () => {
    await connectDB();

    await Vehicle.deleteMany({
      make: {
        $in: ["TestToyota", "TestHonda", "UpdatedToyota"]
      }
    });

    const vehicle = await Vehicle.create({
      make: "TestToyota",
      model: "Camry",
      category: "Sedan",
      price: 2500000,
      quantity: 5
    });

    vehicleId = vehicle._id.toString();

    await Vehicle.create({
      make: "TestHonda",
      model: "Civic",
      category: "Sedan",
      price: 2200000,
      quantity: 3
    });
  });

  afterAll(async () => {
    await Vehicle.deleteMany({
      make: {
        $in: ["TestToyota", "TestHonda", "UpdatedToyota"]
      }
    });

    await mongoose.connection.close();
  });

  describe("POST /api/vehicles", () => {
    it("should create a vehicle with valid details", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send({
          make: "TestToyota",
          model: "Corolla",
          category: "Sedan",
          price: 2000000,
          quantity: 5
        });

      expect(response.status).toBe(201);
      expect(response.body.vehicle).toBeDefined();
      expect(response.body.vehicle.make).toBe("TestToyota");
      expect(response.body.vehicle.model).toBe("Corolla");
      expect(response.body.vehicle.quantity).toBe(5);
    });
  });

  describe("GET /api/vehicles", () => {
    it("should return all available vehicles", async () => {
      const response = await request(app)
        .get("/api/vehicles");

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
      expect(Array.isArray(response.body.vehicles)).toBe(true);
      expect(response.body.vehicles.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/vehicles/search", () => {
    it("should search vehicles by make", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          make: "TestToyota"
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
      expect(response.body.vehicles.length).toBeGreaterThan(0);
      expect(response.body.vehicles[0].make).toBe("TestToyota");
    });

    it("should search vehicles by category", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          category: "Sedan"
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
      expect(response.body.vehicles.length).toBeGreaterThan(0);
    });

    it("should search vehicles by price range", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          minPrice: 2300000,
          maxPrice: 2600000
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
      expect(response.body.vehicles.length).toBeGreaterThan(0);
      expect(response.body.vehicles[0].price).toBe(2500000);
    });
  });

  describe("PUT /api/vehicles/:id", () => {
    it("should update an existing vehicle", async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .send({
          make: "UpdatedToyota",
          model: "Camry",
          category: "SUV",
          price: 2800000,
          quantity: 10
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicle).toBeDefined();
      expect(response.body.vehicle.make).toBe("UpdatedToyota");
      expect(response.body.vehicle.category).toBe("SUV");
      expect(response.body.vehicle.price).toBe(2800000);
      expect(response.body.vehicle.quantity).toBe(10);
    });
  });

  describe("DELETE /api/vehicles/:id", () => {
    let deleteVehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create({
        make: "TestToyota",
        model: "DeleteMe",
        category: "Sedan",
        price: 1800000,
        quantity: 2
      });

      deleteVehicleId = vehicle._id.toString();
    });

    it("should reject deletion without authentication", async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${deleteVehicleId}`);

      expect(response.status).toBe(401);
    });

    it("should reject deletion for a normal user", async () => {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
      }

      const userToken = jwt.sign(
        {
          userId: "normal-user-id",
          role: "user"
        },
        jwtSecret,
        {
          expiresIn: "1h"
        }
      );

      const response = await request(app)
        .delete(`/api/vehicles/${deleteVehicleId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it("should delete a vehicle for an admin user", async () => {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
      }

      const adminToken = jwt.sign(
        {
          userId: "admin-user-id",
          role: "admin"
        },
        jwtSecret,
        {
          expiresIn: "1h"
        }
      );

      const response = await request(app)
        .delete(`/api/vehicles/${deleteVehicleId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Vehicle deleted successfully"
      );
    });
  });
});