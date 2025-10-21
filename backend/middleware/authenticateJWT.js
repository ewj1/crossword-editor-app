import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}
