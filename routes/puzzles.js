import express from "express";
import { ensureAuth } from "../middleware/ensureAuth.js";
import {
  createPuzzle,
  updatePuzzle,
  getPuzzleById,
  getPuzzlesByUser,
} from "../controllers/puzzleController.js";

const router = express.Router();

router.get("/", ensureAuth, getPuzzlesByUser);
router.post("/", ensureAuth, createPuzzle);

router.get("/:id", ensureAuth, getPuzzleById);
router.put("/:id", ensureAuth, updatePuzzle);
// router.delete("/:id", ensureAuth, deletePuzzle);

export default router;
