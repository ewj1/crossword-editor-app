import express from "express";
import { savePuzzle, getPuzzles } from "../controllers/puzzleController.js";

const router = express.Router();

router.post("/", savePuzzle);
router.get("/", getPuzzles);

export default router;
