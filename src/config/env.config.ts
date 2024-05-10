import path from "path";
import dotenv from "dotenv";

/* ------------------ config environment ----------------- */
const envPath = path.join(__dirname, "../", ".env");
dotenv.config({ path: envPath });

export const Env = {
  NODE_ENV: process.env.NODE_ENV?.toString(),
  PORT: process.env.PORT?.toString(),
  DB_URI: process.env.DB_URI?.toString(),
};
