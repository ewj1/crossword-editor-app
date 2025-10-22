import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error("No token provided");
    error.status = 401;
    return next(error);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.status = 403;
    next(error);
  }
}
