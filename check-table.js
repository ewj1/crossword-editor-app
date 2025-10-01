import { db } from "./config/db.js";

async function checkTable() {
  try {
    // Check if users table exists and get its structure
    const tableInfo = await db.raw("DESCRIBE users");
    console.log("Users table structure:", tableInfo[0]);

    // Check if there are any users
    const users = await db("users").select("*");
    console.log("Current users:", users);

    await db.destroy();
  } catch (err) {
    console.error("Error checking table:", err);
    await db.destroy();
  }
}

checkTable();
