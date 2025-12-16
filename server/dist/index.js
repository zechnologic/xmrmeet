import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dbReady } from "./lib/db.js";
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import userRouter from "./routes/user.js";
import meetupRouter from "./routes/meetup.js";
import locationsRouter from "./routes/locations.js";
import reviewsRouter from "./routes/reviews.js";
import adminRouter from "./routes/admin.js";
import { signupLimiter, loginLimiter, settingsLimiter, publicApiLimiter, generalLimiter, } from "./middleware/rateLimiters.js";
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
// Trust proxy for Render deployment
app.set('trust proxy', true);
// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://xmrmeet.onrender.com',
    'https://www.xmrmeet.com',
    'https://xmrmeet.com'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Global middleware
app.use(express.json());
// Apply general rate limiter to all API routes
app.use("/api", generalLimiter);
// Apply specific rate limiters to auth routes
app.use("/signup", signupLimiter);
app.use("/login", loginLimiter);
// Apply settings limiter to user settings endpoint
app.use("/api/user/settings", settingsLimiter);
// Apply public API limiter to meetup endpoints
app.use("/api/meetup", publicApiLimiter);
app.use("/api/locations", publicApiLimiter);
// Register API routes
app.use(signupRouter);
app.use(loginRouter);
app.use(userRouter);
app.use(meetupRouter);
app.use(locationsRouter);
app.use(reviewsRouter);
app.use(adminRouter);
app.use(express.static(path.join(__dirname, "../../client/dist")));
// Handle all routes by serving index.html (SPA fallback)
app.use((_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
// Wait for database to be ready before starting server
async function startServer() {
    try {
        await dbReady;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map