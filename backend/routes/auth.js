import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { attachFullUser } from "../middleware/attachFullUser.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true });
});

router.get("/me", authenticateJWT, attachFullUser, (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  }
  const { name, google_avatar, email } = req.user;
  res.json({ loggedIn: true, user: { name, google_avatar, email } });
});

export default router;
