import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import connectDB from "../config/db";
import Vehicle from "../models/Vehicle";

describe("Vehicle Management", () => {
  beforeAll(async () => {
    await connectDB();

    await Vehicle.deleteMany({
      make: "TestToyota"
    });

    await Vehicle.create({
      make: "TestToyota",
      model: "Camry",
      category: "Sedan",
      price: 2500000,
      quantity: 5
    });
  });

  afterAll(async () => {
    await Vehicle.deleteMany({
      make: "TestToyota"
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

      expect(response.body.vehicle.make).toBe(
        "TestToyota"
      );

      expect(response.body.vehicle.model).toBe(
        "Corolla"
      );

      expect(response.body.vehicle.quantity).toBe(5);
    });
  });

  describe("GET /api/vehicles", () => {
    it("should return all available vehicles", async () => {
      const response = await request(app)
        .get("/api/vehicles");

      expect(response.status).toBe(200);

      expect(response.body.vehicles).toBeDefined();

      expect(Array.isArray(response.body.vehicles)).toBe(
        true
      );

      expect(response.body.vehicles.length).toBeGreaterThan(
        0
      );
    });
  });
});