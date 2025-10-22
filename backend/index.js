import { loadEnv } from "./config/loadEnv.js";
loadEnv();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import puzzleRoutes from "./routes/puzzles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.datamuse.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
    },
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/puzzles", puzzleRoutes);

const staticPath = path.join(__dirname, "../frontend/dist");
app.use(
  express.static(staticPath, {
    maxAge: "30d",
    etag: true,
  })
);

app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
