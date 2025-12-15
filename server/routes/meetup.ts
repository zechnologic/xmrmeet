import express, { Request, Response } from "express";
import { getAvailableUsers } from "../lib/db.js";

const router = express.Router();

// Get all available users for meetups
router.get("/api/meetup", async (req: Request, res: Response) => {
  try {
    const { country, state, city } = req.query;
    const users = await getAvailableUsers(
      country as string | undefined,
      state as string | undefined,
      city as string | undefined
    );

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching available users:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
