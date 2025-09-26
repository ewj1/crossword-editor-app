import { createPuzzle, findPuzzlesByUser } from "../models/puzzleModel.js";

export async function savePuzzle(req, res) {
  const userId = req.user.id;
  const puzzleData = req.body;
  const id = await createPuzzle(userId, puzzleData);
  res.json({ message: "Puzzle saved", id });
}

export async function getPuzzles(req, res) {
  const userId = req.user.id;
  const puzzles = await findPuzzlesByUser(userId);
  res.json(puzzles);
}
