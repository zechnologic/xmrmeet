import express from "express";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { getUserByUsername, getUserById, getApprovedReviewsForUser, getAverageRating, createReview, hasUserReviewedUser, getPendingReviews, approveReview, deleteReview, } from "../db.js";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development";
// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
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
// Middleware to check if user is admin
function requireAdmin(req, res, next) {
    const { userId } = req.user;
    const user = getUserById(userId);
    if (!user || !user.is_admin) {
        return res.status(403).json({
            success: false,
            error: "Admin access required",
        });
    }
    next();
}
// Get user profile with reviews
router.get("/api/user/:username", (req, res) => {
    try {
        const { username } = req.params;
        const user = getUserByUsername(username);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        const reviews = getApprovedReviewsForUser(username);
        const averageRating = getAverageRating(username);
        // Don't expose password or sensitive info
        const { password_hash, ...publicUser } = user;
        res.json({
            success: true,
            user: publicUser,
            reviews,
            averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
            reviewCount: reviews.length,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Submit a review (authenticated)
router.post("/api/reviews", authenticateToken, (req, res) => {
    try {
        const { userId } = req.user;
        const { revieweeUsername, rating, comment } = req.body;
        // Validation
        if (!revieweeUsername || !rating || !comment) {
            return res.status(400).json({
                success: false,
                error: "revieweeUsername, rating, and comment are required",
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: "Rating must be between 1 and 5",
            });
        }
        if (comment.length < 10) {
            return res.status(400).json({
                success: false,
                error: "Comment must be at least 10 characters",
            });
        }
        if (comment.length > 500) {
            return res.status(400).json({
                success: false,
                error: "Comment must be less than 500 characters",
            });
        }
        // Check if reviewee exists
        const reviewee = getUserByUsername(revieweeUsername);
        if (!reviewee) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        // Can't review yourself
        if (userId === reviewee.id) {
            return res.status(400).json({
                success: false,
                error: "You cannot review yourself",
            });
        }
        // Check if user already reviewed this person
        if (hasUserReviewedUser(userId, revieweeUsername)) {
            return res.status(400).json({
                success: false,
                error: "You have already reviewed this user",
            });
        }
        // Create review
        const reviewId = randomBytes(16).toString("hex");
        const review = createReview(reviewId, userId, revieweeUsername, rating, comment);
        res.status(201).json({
            success: true,
            message: "Review submitted for approval",
            review,
        });
    }
    catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Get pending reviews (admin only)
router.get("/api/admin/reviews/pending", authenticateToken, requireAdmin, (req, res) => {
    try {
        const reviews = getPendingReviews();
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
// Approve a review (admin only)
router.put("/api/admin/reviews/:id/approve", authenticateToken, requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const success = approveReview(id);
        if (!success) {
            return res.status(404).json({
                success: false,
                error: "Review not found",
            });
        }
        res.json({
            success: true,
            message: "Review approved",
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
// Delete a review (admin only)
router.delete("/api/admin/reviews/:id", authenticateToken, requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const success = deleteReview(id);
        if (!success) {
            return res.status(404).json({
                success: false,
                error: "Review not found",
            });
        }
        res.json({
            success: true,
            message: "Review deleted",
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
export default router;
//# sourceMappingURL=reviews.js.map