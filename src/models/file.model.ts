import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { ObjectId } from "mongoose";

export class File extends TimeStamps {
  @prop({ unique: false, required: true})
  path: string;

  @prop({ required: true })
  ownerId: ObjectId;
}

export const FileModel = getModelForClass(File);
export type TFile = File & Base;
