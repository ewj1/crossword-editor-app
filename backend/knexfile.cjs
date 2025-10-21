const dotenv = require("dotenv");
const path = require("path");

const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve("./backend/.env.production")
    : path.resolve("./backend/.env");

dotenv.config({ path: envFile, override: true });

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "crossword_user",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "crosswords",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
