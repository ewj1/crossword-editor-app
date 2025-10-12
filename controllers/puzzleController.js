import * as puzzleService from "../services/puzzleService.js";
import { handleController } from "../utils/handleController.js";

export async function createPuzzle(req, res) {
  const result = await puzzleService.createPuzzle(req.user.id, req.body);
  handleController(res, result);
}

export async function updatePuzzle(req, res) {
  const result = await puzzleService.updatePuzzle(
    req.user.id,
    req.params.id,
    req.body
  );
  handleController(res, result, 204);
}

export async function getPuzzlesByUser(req, res) {
  const result = await puzzleService.getPuzzlesByUser(req.user.id);
  handleController(res, result);
}

export async function getPuzzleById(req, res) {
  const result = await puzzleService.getPuzzleById(req.user.id, req.params.id);
  handleController(res, result);
}
