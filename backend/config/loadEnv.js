import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  console.log("loading");
  const env = process.env.NODE_ENV || "development";
  const envFile =
    {
      development: path.resolve(__dirname, "../../.env"),
      test: path.resolve(__dirname, "../../.env.test"),
      production: path.resolve(__dirname, "../../.env.production"),
    }[env] || path.resolve(__dirname, "../../.env");

  console.log(`Loading environment from: ${envFile}`);
  dotenv.config({ path: envFile, override: true });
}
loadEnv();
