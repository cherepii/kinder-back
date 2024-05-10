import { Router } from "express";
import { HomeController } from "../controllers";

export const homeRouter = Router();

homeRouter.get("/", HomeController.renderIndex);
