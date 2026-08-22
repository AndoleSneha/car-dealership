import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../app";
import connectDB from "../config/db";
import User from "../models/User";

describe("Authentication", () => {
  beforeAll(async () => {
    await connectDB();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Remove old test data
    await User.deleteMany({
      email: {
        $in: [
          "test-sneha@example.com",
          "existing@example.com",
          "login-test@example.com"
        ]
      }
    });

    // Create user for duplicate-email test
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: hashedPassword,
      role: "user"
    });

    // Create user for login tests
    await User.create({
      name: "Login Test User",
      email: "login-test@example.com",
      password: hashedPassword,
      role: "user"
    });
  });

  afterAll(async () => {
    // Clean up test users
    await User.deleteMany({
      email: {
        $in: [
          "test-sneha@example.com",
          "existing@example.com",
          "login-test@example.com"
        ]
      }
    });

    await mongoose.connection.close();
  });

  // =========================
  // REGISTRATION TESTS
  // =========================

  describe("User Registration", () => {
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

  // =========================
  // LOGIN TESTS
  // =========================

  describe("User Login", () => {
    it("should login with valid credentials and return a JWT token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login-test@example.com",
          password: "password123"
        });

      expect(response.status).toBe(200);

      expect(response.body.message).toBe(
        "Login successful"
      );

      expect(response.body.token).toBeDefined();

      expect(typeof response.body.token).toBe("string");
    });

    it("should reject login with an incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login-test@example.com",
          password: "wrongpassword"
        });

      expect(response.status).toBe(401);

      expect(response.body.message).toBe(
        "Invalid email or password"
      );
    });

    it("should reject login when the user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "does-not-exist@example.com",
          password: "password123"
        });

      expect(response.status).toBe(401);

      expect(response.body.message).toBe(
        "Invalid email or password"
      );
    });
  });
});