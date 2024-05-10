import { Router } from "express";
import { UserController } from "../controllers";

export const userRouter = Router();

userRouter.get('/', (req, res, next) => {
  const phoneNumber = req.query.phoneNumber;
  if (phoneNumber) UserController.getUserByPhoneNumber(req, res, next);
  else UserController.getUsers(req, res ,next);
});
