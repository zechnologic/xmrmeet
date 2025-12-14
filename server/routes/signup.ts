import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { createUser, getUserByUsername } from "../db.js";

const router = express.Router();
router.use(express.json());

const SALT_ROUNDS = 10;

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Username must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Username already taken",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userId = randomBytes(16).toString("hex");
    const user = createUser(userId, username, passwordHash);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
