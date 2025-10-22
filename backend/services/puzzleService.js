import { db } from "../config/db.js";

export async function createPuzzle(userId, data) {
  const [{ id }] = await db("puzzles")
    .insert({
      user_id: userId,
      title: data.title,
      grid: JSON.stringify(data.grid),
      clues: JSON.stringify(data.clues),
    })
    .returning("id");
  return id;
}

export async function updatePuzzle(userId, puzzleId, data) {
  await verifyPuzzleOwnership(userId, puzzleId);
  await db("puzzles")
    .where("id", puzzleId)
    .update({
      title: data.title,
      grid: JSON.stringify(data.grid),
      clues: JSON.stringify(data.clues),
      last_modified: db.fn.now(),
    });
}

export async function getPuzzlesInfoByUser(userId) {
  const rows = await db("puzzles")
    .where("user_id", userId)
    .select("id", "title", "created_at", "last_modified");
  return rows;
}

export async function getPuzzleById(userId, puzzleId) {
  await verifyPuzzleOwnership(userId, puzzleId);
  const [puzzle] = await db("puzzles").where("id", puzzleId);
  return puzzle;
}

export async function verifyPuzzleOwnership(userId, puzzleId) {
  const [puzzle] = await db("puzzles").where("id", puzzleId);

  if (!puzzle) {
    const error = new Error("Puzzle not found");
    error.status = 404;
    throw error;
  }

  if (puzzle.user_id !== userId) {
    const error = new Error("Unauthorized access");
    error.status = 403;
    throw error;
  }
}
