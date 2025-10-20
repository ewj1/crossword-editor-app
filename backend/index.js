import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import puzzleRoutes from "./routes/puzzles.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
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

app.use("/auth", authRoutes);
app.use("/puzzles", puzzleRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
