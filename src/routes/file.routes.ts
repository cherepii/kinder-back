import { Router } from "express";
import { FileController } from "../controllers";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage });

export const fileRouter = Router();

fileRouter.post('/web-upload', upload.array('files'), FileController.uploadFileFromWeb);
fileRouter.post('/telegram-upload', FileController.uploadFileFromTelegram);
fileRouter.get('/', FileController.getUserFiles);
