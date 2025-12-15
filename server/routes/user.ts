import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById, updateUserSettings } from "../lib/db.js";
import { geocoder } from "../services/geocoder.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development";

interface JWTPayload {
  userId: string;
  username: string;
}

// Middleware to verify JWT token
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}

// Get current user profile
router.get("/api/user/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Don't send password hash to client
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update user settings
router.put("/api/user/settings", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const { country, postalCode, availableSellXmr, availableBuyXmr, contactInfo } = req.body;

    // Validation
    if (typeof availableSellXmr !== "boolean" || typeof availableBuyXmr !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "availableSellXmr and availableBuyXmr must be boolean values",
      });
    }

    // Geocode location if provided
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (country && postalCode) {
      try {
        const coords = await geocoder.geocodePostalCode(country, postalCode);

        if (coords) {
          latitude = coords.lat;
          longitude = coords.lon;
        } else {
          console.warn(`Failed to geocode postal code for user ${userId}: ${country}, ${postalCode}`);
        }
      } catch (error) {
        console.error(`Geocoding error for user ${userId}:`, error);
        // Continue with save even if geocoding fails
      }
    }

    const updatedUser = await updateUserSettings(
      userId,
      country || null,
      postalCode || null,
      latitude,
      longitude,
      availableSellXmr,
      availableBuyXmr,
      contactInfo || null
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: "Settings updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
