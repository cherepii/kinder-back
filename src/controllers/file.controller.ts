import expressAsyncHandler from "express-async-handler";
import { TTelegramFileUploadDto, TUpdateFileStatusDto, TWebFileUploadDto } from "../dto";
import { FileModel, TFile, UserModel } from "../models";
import { createWriteStream, existsSync, unlinkSync } from "fs";
import path from "path";
import fetch from "node-fetch";
import { mkdir } from "fs/promises";
import { Env, userFilesStatusesMap } from "../config";
import { FileStatusesEnum } from "../types";

/**
 * POST /files/web-upload
 * Upload files from web.
 */
const uploadFileFromWeb = expressAsyncHandler<any, any, TWebFileUploadDto>(async(req, res) => {
  const files = req.files;
  const body = req.body;

  const formattedPhone = body.phoneNumber?.replace(/\D/g, '');
  
  if (!files) {
    throw { status: 400, message: 'File not found' };
  }
  if (!formattedPhone) {
    throw { status: 400, message: 'Заполните обязательное поле номер телефона!' };
  }

  const user = await UserModel
  .findOneAndUpdate(
    { phoneNumber: formattedPhone },
    { email: body.email, username: body.username }, { upsert: true, new: true },
  );

  for (const file of (files as Express.Multer.File[])) {
    const filePath = `/uploads/${file.filename}`;
    await FileModel.create({ path: filePath, owner: user._id });
  }
  
  res.status(200).json({ message: 'File uploaded successfully' });
});

/**
 * POST /files/telegram-upload
 * Upload files from telegram bot.
 */
const uploadFileFromTelegram = expressAsyncHandler<any, any, TTelegramFileUploadDto>(async (req, res) => {
  const { instagramName, phoneNumber, photoUrls, tg_user_id, tg_username, username } = req.body;

  const formattedPhone = phoneNumber?.replace(/\D/g, '');

  if (!formattedPhone)
    throw {
      status: 400,
      message: 'Invalid phone number',
    };

  const user = await UserModel.findOneAndUpdate(
    { phoneNumber: formattedPhone },
    { instagramName, tg_user_id, tg_username, username }, { upsert: true, new: true },
  );

  const uploadsFolder = path.join(__dirname, '../..', 'uploads');

  if (!existsSync(uploadsFolder)) {
    console.log('Create uploads folder');
    await mkdir(uploadsFolder);
  }

  for (const url of photoUrls) {
    const res = await fetch(url);
    if (!res.ok) {
      throw {
        status: 400,
        message: 'Could not fetch an image',
      };
    }

    const extension = url.split(".").pop();
    const fileName = `${Date.now()}.${extension}`;
    const writePath = path.join(uploadsFolder, fileName);
    
    res.body.pipe(createWriteStream(writePath));
    await FileModel.create({ path: `/uploads/${fileName}` , owner: user._id });
  }

  res.status(200).json({ message: 'Files uploaded successfully' });
});

/**
 * GET /files?phoneNumber={value}
 * Get files for single user
 */
const getUserFiles = expressAsyncHandler<any, any, any, {phoneNumber: string}>(async (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  const formattedPhone = phoneNumber?.replace(/\D/g, '');

  if (!formattedPhone)
    throw {
      status: 400,
      message: 'Invalid phone number',
    };

  const user = await UserModel.findOne({ phoneNumber: formattedPhone }).populate('files');
  
  const apiUrl = Env.API_URL;
  const files: string[] = [];

  user?.files?.forEach((file) => {
    const readableStatus = userFilesStatusesMap[(file as TFile)?.status as FileStatusesEnum];
    
    files.push(`Статус фото: ${readableStatus}`);
    files.push(apiUrl + (file as TFile)?.path);
  });

  res.status(200).json({ files, message: files?.length ? 'Client' : 'User not found' });
});

/**
 * DELETE /files/:id
 * Delete file by id
 */
const deleteFileById = expressAsyncHandler<{id: string}>(async (req, res) => {
  const fileId = req.params.id;

  if (!fileId)
    throw {
      status: 400,
      message: 'File id is required',
    };
  
  const file = await FileModel.findByIdAndDelete(fileId);

  if (!file) throw {
    status: 400,
    message: 'File not found',
  };
  
  const filePath = path.join(__dirname, '../..', file.path);

  unlinkSync(filePath);

  res.status(200).json({ message: 'File deleted successfully' });
});

/**
 * PUT /files/:id
 * update file status by id
 */
export const updateFileStatusById = expressAsyncHandler<{id: string}, any, TUpdateFileStatusDto>(async(req, res) => {
  const { status } = req.body;
  const fileId = req.params.id;

  const updatedFile = await FileModel.findByIdAndUpdate(fileId, { status });
  if (!updatedFile) throw {
    status: 400,
    message: 'File not found',
  };

  res.status(200).json({ message: 'File status updated successfully' });
});

export const getAllFiles = expressAsyncHandler<any, any, any, {status: FileStatusesEnum}>(async(req, res) => {
  const status = req.query.status;
  
  const query = status ? { status } : {};
  
  const files = await FileModel.find(query).populate('owner', '', UserModel);
  res.status(200).json({ files });
});

export const FileController = {
  uploadFileFromWeb,
  uploadFileFromTelegram,
  getUserFiles,
  deleteFileById,
  updateFileStatusById,
  getAllFiles,
};
