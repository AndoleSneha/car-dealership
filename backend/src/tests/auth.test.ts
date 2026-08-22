import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import connectDB from "../config/db";
import User from "../models/User";

describe("User Registration", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({
      email: {
        $in: [
          "test-sneha@example.com",
          "existing@example.com"
        ]
      }
    });

    await mongoose.connection.close();
  });

  it("should register a user with valid details", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sneha",
        email: "test-sneha@example.com",
        password: "password123"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "User registered successfully"
    );
  });

  it("should not register a user with an existing email", async () => {
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123"
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "existing@example.com",
        password: "password123"
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "User already exists"
    );
  });

  it("should reject registration when name is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "missing-name@example.com",
        password: "password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Name, email and password are required"
    );
  });

  it("should reject registration when email is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sneha",
        password: "password123"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Name, email and password are required"
    );
  });

  it("should reject registration when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sneha",
        email: "missing-password@example.com"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Name, email and password are required"
    );
  });
});