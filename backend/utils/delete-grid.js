import { db } from "../config/db.js";

async function deleteGrid() {
  await db("puzzles").truncate();
}
deleteGrid();
