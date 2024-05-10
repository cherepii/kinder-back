import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { homeRouter, fileRouter, userRouter } from "./routes";
import { Env } from "./config";
// Create Express server
export const app = express();

// Express configuration
app.set("port", Env.PORT || 3000);
app.set("node_env", Env.NODE_ENV);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use('/api/uploads', express.static(path.join(__dirname, "../uploads")));

app.use("/api", homeRouter);
app.use("/api/files", fileRouter);
app.use("/api/users", userRouter);

app.use(errorNotFoundHandler);
app.use(errorHandler);
