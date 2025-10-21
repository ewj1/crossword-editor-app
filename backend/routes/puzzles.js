import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import {
  createPuzzle,
  updatePuzzle,
  getPuzzleById,
  getPuzzlesInfoByUser,
} from "../controllers/puzzleController.js";

const router = express.Router();

router.get("/", authenticateJWT, getPuzzlesInfoByUser);
router.post("/", authenticateJWT, createPuzzle);

router.get("/:id", authenticateJWT, getPuzzleById);
router.put("/:id", authenticateJWT, updatePuzzle);
// router.delete("/:id", authenticateJWT, deletePuzzle);

export default router;
