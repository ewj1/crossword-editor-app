import { createPuzzle, findPuzzlesByUser } from "../models/puzzleModel.js";

export const savePuzzle = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });

  const { title, data } = req.body;
  const puzzleId = await createPuzzle(req.user.id, title, data);
  res.json({ success: true, puzzleId });
};

export const getPuzzles = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });

  const puzzles = await findPuzzlesByUser(req.user.id);
  res.json(puzzles);
};
