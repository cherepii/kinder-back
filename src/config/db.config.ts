//eslint-disable
import mongoose from "mongoose";
import { Env } from "./env.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(Env.DB_URI);
    console.log(`DB connection established!`.cyan.bold);
  } catch (error: any) {
    console.error(`DB connection error: ${error?.message}`.red.bold);
    process.exit(1);
  }
};
