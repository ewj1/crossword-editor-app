import { db } from "../config/db.js";

export async function findUserByGoogleId(googleId) {
  const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [
    googleId,
  ]);
  return rows[0];
}

export async function createUser(profile) {
  const { id, displayName, emails } = profile;
  const email = emails[0].value;
  const [result] = await db.execute(
    "INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)",
    [id, displayName, email]
  );
  return { id: result.insertId, google_id: id, name: displayName, email };
}
