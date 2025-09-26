import express from "express";
import { savePuzzle, getPuzzles } from "../controllers/puzzleController.js";

const router = express.Router();
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

router.post("/save", ensureAuth, savePuzzle);
router.get("/", ensureAuth, getPuzzles);

export default router;
