import { db } from "../config/db.js";

async function checkTable() {
  try {
    // Check if users table exists and get its structure
    const userInfo = await db.raw("DESCRIBE users");
    console.log("Users table structure:", userInfo[0]);
    // Check if there are any users
    const users = await db("users").select("*");
    console.log("Current users:", users);

    // Check if puzzles table exists and get its structure
    const puzzlesInfo = await db.raw("DESCRIBE puzzles");
    console.log("Puzzles table structure:", puzzlesInfo[0]);
    // Check if there are any puzzles
    const puzzles = await db("puzzles").select("*");
    console.log("Current puzzles:", puzzles);
  } catch (err) {
    console.error("Error checking table:", err);
  } finally {
    await db.destroy();
  }
}

checkTable();
