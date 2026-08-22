import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app";
import connectDB from "../config/db";
import Vehicle from "../models/Vehicle";

describe("Vehicle Management", () => {
  let vehicleId: string;

  beforeAll(async () => {
    await connectDB();

    await Vehicle.deleteMany({
      make: {
        $in: [
          "TestToyota",
          "TestHonda",
          "UpdatedToyota",
          "TestPurchase",
          "TestValidation"
        ]
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
        $in: [
          "TestToyota",
          "TestHonda",
          "UpdatedToyota",
          "TestPurchase",
          "TestValidation"
        ]
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

    it("should reject vehicle creation when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send({
          make: "TestValidation"
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Make, model, category, price and quantity are required"
      );
    });

    it("should reject vehicle creation with negative price", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send({
          make: "TestValidation",
          model: "NegativePrice",
          category: "Sedan",
          price: -1000,
          quantity: 5
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Price and quantity cannot be negative"
      );
    });

    it("should reject vehicle creation with negative quantity", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send({
          make: "TestValidation",
          model: "NegativeQuantity",
          category: "Sedan",
          price: 1000000,
          quantity: -5
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Price and quantity cannot be negative"
      );
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

    it("should search vehicles by model", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          model: "Camry"
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
      expect(response.body.vehicles.length).toBeGreaterThan(0);
      expect(response.body.vehicles[0].model).toBe("Camry");
    });

    it("should search vehicles using only minimum price", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          minPrice: 2400000
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
    });

    it("should search vehicles using only maximum price", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          maxPrice: 2300000
        });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
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

    it("should reject update when required fields are missing", async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .send({
          make: "UpdatedToyota"
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Make, model, category, price and quantity are required"
      );
    });

    it("should reject update with negative price", async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .send({
          make: "UpdatedToyota",
          model: "Camry",
          category: "SUV",
          price: -500,
          quantity: 5
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Price and quantity cannot be negative"
      );
    });

    it("should return 404 when updating a non-existent vehicle", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .send({
          make: "TestToyota",
          model: "Camry",
          category: "Sedan",
          price: 2000000,
          quantity: 5
        });

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Vehicle not found"
      );
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

    it("should return 404 when deleting a non-existent vehicle", async () => {
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

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/vehicles/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Vehicle not found"
      );
    });
  });

  describe("POST /api/vehicles/:id/purchase", () => {
    let purchaseVehicleId: string;
    let outOfStockVehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create({
        make: "TestPurchase",
        model: "AvailableCar",
        category: "Sedan",
        price: 2000000,
        quantity: 5
      });

      purchaseVehicleId = vehicle._id.toString();

      const outOfStockVehicle = await Vehicle.create({
        make: "TestPurchase",
        model: "OutOfStockCar",
        category: "SUV",
        price: 3000000,
        quantity: 0
      });

      outOfStockVehicleId =
        outOfStockVehicle._id.toString();
    });

    it("should purchase a vehicle and decrease its quantity", async () => {
      const response = await request(app)
        .post(`/api/vehicles/${purchaseVehicleId}/purchase`);

      expect(response.status).toBe(200);

      expect(response.body.vehicle).toBeDefined();

      expect(response.body.vehicle.quantity).toBe(4);
    });

    it("should reject purchase when quantity is zero", async () => {
      const response = await request(app)
        .post(
          `/api/vehicles/${outOfStockVehicleId}/purchase`
        );

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Vehicle is out of stock"
      );
    });

    it("should return 404 when purchasing a non-existent vehicle", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`);

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Vehicle not found"
      );
    });
  });

  describe("POST /api/vehicles/:id/restock", () => {
    let restockVehicleId: string;

    beforeEach(async () => {
      const vehicle = await Vehicle.create({
        make: "TestPurchase",
        model: "RestockCar",
        category: "SUV",
        price: 3000000,
        quantity: 5
      });

      restockVehicleId = vehicle._id.toString();
    });

    it("should reject restocking without authentication", async () => {
      const response = await request(app)
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(401);
    });

    it("should reject restocking for a normal user", async () => {
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
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(403);
    });

    it("should restock a vehicle for an admin user", async () => {
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
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(200);

      expect(response.body.vehicle).toBeDefined();

      expect(response.body.vehicle.quantity).toBe(8);
    });

    it("should reject restocking with zero quantity", async () => {
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
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          quantity: 0
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Restock quantity must be greater than 0"
      );
    });

    it("should reject restocking with negative quantity", async () => {
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
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          quantity: -2
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Restock quantity must be greater than 0"
      );
    });

    it("should return 404 when restocking a non-existent vehicle", async () => {
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

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/vehicles/${fakeId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          quantity: 3
        });

      expect(response.status).toBe(404);

      expect(response.body.message).toBe(
        "Vehicle not found"
      );
    });
  });
});