import express from "express";
import { getAvailableUsers } from "../db.js";
const router = express.Router();
router.use(express.json());
// Get all available users for meetups
router.get("/api/meetup", (req, res) => {
    try {
        const { country, state, city } = req.query;
        const users = getAvailableUsers(country, state, city);
        res.json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("Error fetching available users:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
export default router;
//# sourceMappingURL=meetup.js.map