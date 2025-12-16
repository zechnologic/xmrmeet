import express from "express";
import jwt from "jsonwebtoken";
import { getUserById, getPendingReviews, approveReview, deleteReview, getAllUsers } from "../lib/db.js";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
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
// Middleware to verify admin access
async function authenticateAdmin(req, res, next) {
    try {
        const { userId } = req.user;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        // Check if user is admin either by is_admin flag or by matching ADMIN_USERNAME
        const isAdmin = user.is_admin === 1 || (ADMIN_USERNAME && user.username === ADMIN_USERNAME);
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Admin access required",
            });
        }
        next();
    }
    catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
// Get all pending reviews
router.get("/api/admin/reviews/pending", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const reviews = await getPendingReviews();
        res.json({
            success: true,
            reviews,
        });
    }
    catch (error) {
        console.error("Error fetching pending reviews:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Approve a review
router.put("/api/admin/reviews/:id/approve", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const success = await approveReview(id);
        if (!success) {
            return res.status(404).json({
                success: false,
                error: "Review not found",
            });
        }
        res.json({
            success: true,
            message: "Review approved successfully",
        });
    }
    catch (error) {
        console.error("Error approving review:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Delete a review
router.delete("/api/admin/reviews/:id", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const success = await deleteReview(id);
        if (!success) {
            return res.status(404).json({
                success: false,
                error: "Review not found",
            });
        }
        res.json({
            success: true,
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Check if current user is admin
router.get("/api/admin/check", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        const isAdmin = user.is_admin === 1 || (ADMIN_USERNAME && user.username === ADMIN_USERNAME);
        res.json({
            success: true,
            isAdmin,
        });
    }
    catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Get all users
router.get("/api/admin/users", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
export default router;
//# sourceMappingURL=admin.js.map