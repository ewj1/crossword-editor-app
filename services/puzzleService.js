import { db } from "../config/db.js";
import { handleService } from "../utils/handleService.js";

export async function createPuzzle(userId, data) {
  return handleService(async () => {
    const [insertId] = await db("puzzles").insert({
      user_id: userId,
      title: data.title,
      grid: JSON.stringify(data.grid),
      clues: JSON.stringify(data.clues),
    });
    return insertId;
  });
}

export async function updatePuzzle(userId, puzzleId, data) {
  return handleService(async () => {
    await verifyPuzzleOwnership(userId, puzzleId);
    await db("puzzles")
      .where("id", puzzleId)
      .update({
        title: data.title,
        grid: JSON.stringify(data.grid),
        clues: JSON.stringify(data.clues),
        last_modified: db.fn.now(),
      });
  });
}

export async function getPuzzlesInfoByUser(userId) {
  return handleService(async () => {
    const rows = await db("puzzles")
      .where("user_id", userId)
      .select("id", "title", "created_at", "last_modified");
    return rows;
  });
}

export async function getPuzzleById(userId, puzzleId) {
  return handleService(async () => {
    await verifyPuzzleOwnership(userId, puzzleId);

    const [puzzle] = await db("puzzles").where("id", puzzleId);
    return puzzle;
  });
}

export async function verifyPuzzleOwnership(userId, puzzleId) {
  const [puzzle] = await db("puzzles").where("id", puzzleId);
  if (!puzzle) throw { status: 404, message: "Puzzle not found" };
  if (puzzle.user_id !== userId)
    throw { status: 403, message: "Unauthorized access" };
}
