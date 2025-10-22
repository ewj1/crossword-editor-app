import * as puzzleService from "../services/puzzleService.js";

export async function createPuzzle(req, res) {
  const puzzleId = await puzzleService.createPuzzle(req.user.id, req.body);
  res.status(201).json({ success: true, data: puzzleId });
}

export async function updatePuzzle(req, res) {
  const result = await puzzleService.updatePuzzle(
    req.user.id,
    req.params.id,
    req.body
  );
  res.status(204).json({ success: true, data: null });
}

export async function getPuzzlesInfoByUser(req, res) {
  const info = await puzzleService.getPuzzlesInfoByUser(req.user.id);
  res.status(200).json({ success: true, data: info });
}

export async function getPuzzleById(req, res) {
  const puzzle = await puzzleService.getPuzzleById(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: puzzle });
}
