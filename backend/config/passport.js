import path from "path";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateUser } from "../controllers/authController.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve("./.env.production")
    : path.resolve("./.env");

dotenv.config({ path: envFile, override: true });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, googleProfile, done) => {
      try {
        const user = await findOrCreateUser(googleProfile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
