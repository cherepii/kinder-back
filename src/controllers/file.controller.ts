import expressAsyncHandler from "express-async-handler";
import { TTelegramFileUploadDto, TWebFileUploadDto } from "../dto";
import { FileModel, UserModel } from "../models";
import { createWriteStream, existsSync } from "fs";
import path from "path";
import fetch from "node-fetch";
import { mkdir } from "fs/promises";

/**
 * POST /files/web-upload
 * Upload files from web.
 */
const uploadFileFromWeb = expressAsyncHandler<any, any, TWebFileUploadDto>(async(req, res) => {
  const files = req.files;
  const body = req.body;
  
  if (!files) {
    throw { status: 400, message: 'File not found' };
  }
  if (!body.phoneNumber) {
    throw { status: 400, message: 'Заполните обязательное поле номер телефона!' };
  }

  const user = await UserModel
  .findOneAndUpdate(
    { phoneNumber: body.phoneNumber },
    { email: body.email, username: body.username }, { upsert: true, new: true },
  );

  for (const file of (files as Express.Multer.File[])) {
    const filePath = `/uploads/${file.filename}`;
    await FileModel.create({ path: filePath, ownerId: user._id });
  }
  
  res.status(200).json({ message: 'File uploaded successfully' });
});

/**
 * POST /files/telegram-upload
 * Upload files from telegram bot.
 */
const uploadFileFromTelegram = expressAsyncHandler<any, any, TTelegramFileUploadDto>(async (req, res) => {
  const { instagramName, phoneNumber, photoUrls, tg_user_id, tg_username, username } = req.body;

  const user = await UserModel.findOneAndUpdate(
    { phoneNumber },
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
    await FileModel.create({ path: `/uploads/${fileName}` , ownerId: user._id });
  }

  res.status(200).json({ message: 'Files uploaded successfully' });
});

export const FileController = {
  uploadFileFromWeb,
  uploadFileFromTelegram,
};
