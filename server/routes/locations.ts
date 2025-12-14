import express, { Request, Response } from "express";
import { LOCATIONS } from "../data/locations.js";

const router = express.Router();

// Get all available countries and their states
router.get("/api/locations", (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      locations: LOCATIONS,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
