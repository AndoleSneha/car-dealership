import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required"
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists"
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required"
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password"
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: "Invalid email or password"
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        message: "JWT secret is not configured"
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      jwtSecret,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};