import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import puzzleRoutes from "./routes/puzzles.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/puzzles", puzzleRoutes);

const staticPath = path.join(__dirname, "../frontend/dist");
app.use(
  express.static(staticPath, {
    maxAge: "30d",
    etag: true,
  })
);

app.get("*", (req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
