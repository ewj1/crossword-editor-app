import { findUserById } from "../services/userService.js";

export async function attachFullUser(req, res, next) {
  if (!req.user?.id) return next();
  try {
    const fullUser = await findUserById(req.user.id);
    req.user = fullUser;
    next();
  } catch (err) {
    next(err);
  }
}
