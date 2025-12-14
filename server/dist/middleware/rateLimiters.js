import rateLimit from "express-rate-limit";
// Very strict signup limiter - 3 signups per IP per day
export const signupLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3,
    message: {
        success: false,
        error: "Too many accounts created from this IP. Please try again in 24 hours.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Aggressive login limiter - 5 failed attempts per IP per hour
export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        success: false,
        error: "Too many login attempts. Please try again in 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Settings update limiter - 20 updates per hour per user
export const settingsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
        success: false,
        error: "Too many settings updates. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Public API limiter - prevent scraping - 100 requests per minute per IP
export const publicApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: {
        success: false,
        error: "Too many requests. Please slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// General API limiter - 200 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: {
        success: false,
        error: "Too many requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiters.js.map