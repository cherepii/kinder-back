//eslint-disable
import mongoose from "mongoose";
import { Env } from "./env.config";

const options = Env.NODE_ENV === 'production'
  ? { user: Env.DB_USER, pass: Env.DB_PWD }
  : undefined;

export const connectDB = async () => {
  try {
    await mongoose.connect(Env.DB_URI, options);
    console.log(`DB connection established!`.cyan.bold);
  } catch (error: any) {
    console.error(`DB connection error: ${error?.message}`.red.bold);
    process.exit(1);
  }
};
