import { Ref, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { File } from "./file.model";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class User extends TimeStamps {
  @prop({unique: false, required: true, default: null})
  username: string;

  @prop({ required: false, default: null })
  instagramName: string;
  
  @prop({unique: true, required: true})
  phoneNumber: string;

  @prop({required: false, default: null})
  tg_username: string;

  @prop({required: false, default: null})
  tg_user_id: number;

  @prop({
    ref: () => File,
    foreignField: 'ownerId',
    localField: '_id',
    autopopulate: true,
  })
  files: Ref<File>[];
}

export const UserModel = getModelForClass(User);
export type TUser = User & Base;
