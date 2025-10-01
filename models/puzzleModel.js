import { db } from "../config/db.js";

export const createPuzzle = async (userId, title, data) => {
  const [insertId] = await db("puzzles").insert({
    user_id: userId,
    title: title,
    data: JSON.stringify(data),
  });
  return insertId;
};

export const findPuzzlesByUser = async (userId) => {
  const rows = await db("puzzles").where("user_id", userId);
  return rows;
};
