import { db } from "../config/db.js";

export const createPuzzle = async (userId, title, data) => {
  const [result] = await db.query(
    "INSERT INTO puzzles (user_id, title, data) VALUES (?, ?, ?)",
    [userId, title, JSON.stringify(data)]
  );
  return result.insertId;
};

export const findPuzzlesByUser = async (userId) => {
  const [rows] = await db.query("SELECT * FROM puzzles WHERE user_id = ?", [
    userId,
  ]);
  return rows;
};
