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
const getUserByPhoneNumber = expressAsyncHandler<any, any, any, {phoneNumber: string}>(async (req, res) => {
  const phoneNumber = req.query.phoneNumber;

  const formattedPhone = phoneNumber?.replace(/\D/g, '');
  
  if (!formattedPhone) 
    throw { status: 400, message: 'Invalid phone number' };

  const user = await UserModel
    .findOne({ phoneNumber: formattedPhone })
    .select('-__v')
    .populate('files', 'path createdAt');
  
  if (!user)
    throw { status: 400, message: 'User not found' };

  res.status(200).json({ user });
});

export const UserController = {
  getUsers,
  getUserByPhoneNumber,
};
