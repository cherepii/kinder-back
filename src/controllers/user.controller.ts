import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models";

/**
 * GET /api/users
 * Get all users list
 */
const getUsers = expressAsyncHandler(async(req, res) => {
  const users = await UserModel
    .find()
    .select('-password -__v')
    .populate('files', 'path createdAt');

  res.status(200).json({ users });
});

/**
 * GET /api/users?phoneNumber=value
 * Get user by phone number
 */
const getUserByPhoneNumber = expressAsyncHandler(async (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  if (!phoneNumber) 
    throw { status: 400, message: 'Invalid phone number' };

  const user = await UserModel.findOne({ phoneNumber }).select('-__v').populate('files', 'path createdAt');
  if (!user)
    throw { status: 400, message: 'User not found' };

  res.status(200).json({ user });
});

export const UserController = {
  getUsers,
  getUserByPhoneNumber,
};
