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
        message: "Name, email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    // HASH PASSWORD ONLY ONCE
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    console.log("User registered:", {
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", {
      email,
      passwordProvided: !!password,
    });

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      console.log("USER NOT FOUND:", cleanEmail);

      res.status(401).json({
        message: "Invalid email or password",
      });

      return;
    }

    console.log("USER FOUND:", {
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
    });

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", passwordMatches);

    if (!passwordMatches) {
      res.status(401).json({
        message: "Invalid email or password",
      });

      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing");

      res.status(500).json({
        message: "JWT secret is not configured",
      });

      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    console.log("LOGIN SUCCESS:", {
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};