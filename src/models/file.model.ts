import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { ObjectId } from "mongoose";
import { FileStatusesEnum } from "../types";

export class File extends TimeStamps {
  @prop({ unique: false, required: true})
  path: string;

  @prop({ required: true })
  owner: ObjectId;

  //need to delete
  @prop({ required: false })
  ownerId: ObjectId;

  @prop({ required: false, default: FileStatusesEnum.SIGNED })
  status: string;
}

export const FileModel = getModelForClass(File);
export type TFile = File & Base;
