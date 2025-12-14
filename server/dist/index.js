import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import userRouter from "./routes/user.js";
import meetupRouter from "./routes/meetup.js";
import locationsRouter from "./routes/locations.js";
import { runMigrations } from "./db/migrations.js";
import { signupLimiter, loginLimiter, settingsLimiter, publicApiLimiter, generalLimiter, } from "./middleware/rateLimiters.js";
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Run database migrations
runMigrations();
const app = express();
const PORT = process.env.PORT || 3000;
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
app.use(express.static(path.join(__dirname, "../../client/dist")));
// Handle all routes by serving index.html (SPA fallback)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map