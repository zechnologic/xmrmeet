import express from "express";
import jwt from "jsonwebtoken";
import { getUserById, updateUserSettings } from "../db.js";
const router = express.Router();
router.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development";
// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Access token required",
        });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
}
// Get current user profile
router.get("/api/user/me", authenticateToken, (req, res) => {
    try {
        const { userId } = req.user;
        const user = getUserById(userId);
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
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Update user settings
router.put("/api/user/settings", authenticateToken, (req, res) => {
    try {
        const { userId } = req.user;
        const { country, state, city, availableSellXmr, availableBuyXmr, contactInfo } = req.body;
        // Validation
        if (typeof availableSellXmr !== "boolean" || typeof availableBuyXmr !== "boolean") {
            return res.status(400).json({
                success: false,
                error: "availableSellXmr and availableBuyXmr must be boolean values",
            });
        }
        const updatedUser = updateUserSettings(userId, country || null, state || null, city || null, availableSellXmr, availableBuyXmr, contactInfo || null);
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
    }
    catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
export default router;
//# sourceMappingURL=user.js.map