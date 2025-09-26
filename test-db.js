import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("✅ Connected to MySQL!");
    await connection.end();
  } catch (err) {
    console.error("❌ Failed to connect:", err);
  }
}

testDB();
