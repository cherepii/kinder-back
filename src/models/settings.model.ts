import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";

export class Settings extends TimeStamps {
  @prop({ required: false, default: false })
  siteEnabled: boolean;
}

export const SettingsModel = getModelForClass(Settings);
