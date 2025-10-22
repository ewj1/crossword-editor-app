const path = require("path");
const dotenv = require("dotenv");

console.log("loading env vars...");
const env = process.env.NODE_ENV || "development";
const envFile =
  {
    development: path.resolve(__dirname, "../../.env"),
    test: path.resolve(__dirname, "../../.env.test"),
    production: path.resolve(__dirname, "../../.env.production"),
  }[env] || path.resolve(__dirname, "../../.env");

console.log(`Loading environment from: ${envFile}`);
dotenv.config({ path: envFile, override: true });
