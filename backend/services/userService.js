import { db } from "../config/db.js";

export async function findUserById(id) {
  const user = await db("users").where("id", id).first();
  return user;
}

export async function findUserByGoogleId(googleId) {
  const rows = await db("users").where("google_id", googleId).first();
  return rows;
}

export async function createUser(profile) {
  const { id: googleId, displayName, emails, photos } = profile;
  await db("users").insert({
    google_id: googleId,
    name: displayName,
    email: emails[0].value,
    google_avatar: photos[0].value,
  });
  return findUserByGoogleId(googleId);
}
