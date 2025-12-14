import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import userRouter from "./routes/user.js";
import meetupRouter from "./routes/meetup.js";
import locationsRouter from "./routes/locations.js";
// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
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