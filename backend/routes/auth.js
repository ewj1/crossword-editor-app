import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    const { name, google_avatar, email } = req.user;
    res.json({ loggedIn: true, user: { name, google_avatar, email } });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
