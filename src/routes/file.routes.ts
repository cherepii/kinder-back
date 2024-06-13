import { Request, Router } from "express";
import { FileController } from "../controllers";

import multer, { FileFilterCallback } from "multer";
import path from "path";

const FIVE_MB_IN_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const fileType = file.mimetype.split('/')[0];
  if (fileType === 'image') return cb(null, true);
  return cb(new Error('Only image formats are allowed'));
};

const upload = multer({ storage, limits: { fileSize: FIVE_MB_IN_BYTES }, fileFilter });

export const fileRouter = Router();

fileRouter.post('/web-upload', upload.array('files'), FileController.uploadFileFromWeb);
fileRouter.post('/telegram-upload', FileController.uploadFileFromTelegram);
fileRouter.get('/', FileController.getUserFiles);
fileRouter.delete('/:id', FileController.deleteFileById);
