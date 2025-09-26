import { findUserByGoogleId, createUser } from "../models/userModel.js";
import { db } from "../config/db.js";

export async function findOrCreateUser(profile) {
  let user = await findUserByGoogleId(profile.id);
  if (!user) {
    user = await createUser(profile);
  }
  return user;
}

export async function getUserById(id) {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}
