import { FileStatusesEnum } from "../types";

export type TWebFileUploadDto = {
  email: string
  phoneNumber: string
  username: string
};

export type TTelegramFileUploadDto = {
  phoneNumber: string
  instagramName: string
  username: string
  photoUrls: string[]
  tg_user_id: number
  tg_username: string
};

export type TUpdateFileStatusDto = {
  status: FileStatusesEnum
};
