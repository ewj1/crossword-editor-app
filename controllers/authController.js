import { findUserByGoogleId, createUser } from "../models/userModel.js";
import { db } from "../config/db.js";

export async function findOrCreateUser(googleProfile) {
  let user = await findUserByGoogleId(googleProfile.id);
  if (!user) {
    user = await createUser(googleProfile);
  }
  return user;
}
