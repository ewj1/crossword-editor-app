import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv() {
  const env = process.env.NODE_ENV || "development";
  const envFile =
    {
      test: path.resolve(__dirname, "../.env.test"),
      development: path.resolve(__dirname, "../.env"),
    }[env] || path.resolve(__dirname, "../.env");

  console.log(`Loading environment from: ${envFile}`);
  dotenv.config({ path: envFile, override: true });
}
