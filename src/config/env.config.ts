import path from "path";
import dotenv from "dotenv";

/* ------------------ config environment ----------------- */
const envPath = path.join(__dirname, "../", ".env");
dotenv.config({ path: envPath });

export const Env = {
  API_URL: process.env.API_URL?.toString(),
  NODE_ENV: process.env.NODE_ENV?.toString(),
  PORT: process.env.PORT?.toString(),
  DB_URI: process.env.DB_URI?.toString(),
  DB_USER: process.env.DB_USER?.toString(),
  DB_PWD: process.env.DB_PWD?.toString(),
};
