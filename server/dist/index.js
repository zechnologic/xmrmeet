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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", true);
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://xmrmeet.onrender.com",
    "https://www.xmrmeet.com",
    "https://xmrmeet.com",
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use("/api", generalLimiter);
app.use("/signup", signupLimiter);
app.use("/login", loginLimiter);
app.use("/api/user/settings", settingsLimiter);
app.use("/api/meetup", publicApiLimiter);
app.use("/api/locations", publicApiLimiter);
app.use(signupRouter);
app.use(loginRouter);
app.use(userRouter);
app.use(meetupRouter);
app.use(locationsRouter);
app.use(reviewsRouter);
app.use(adminRouter);
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use((_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
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