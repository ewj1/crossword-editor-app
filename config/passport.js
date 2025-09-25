import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [
        profile.id,
      ]);
      let user = rows[0];
      if (!user) {
        const [result] = await db.query(
          "INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)",
          [profile.id, profile.displayName, profile.emails[0].value]
        );
        user = {
          id: result.insertId,
          google_id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
