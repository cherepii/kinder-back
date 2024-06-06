import { Router } from "express";
import { SettingsModel } from "../models";

export const settingsRouter = Router();

settingsRouter.get('/', async(req, res) => {
  const data = await SettingsModel
    .findOneAndUpdate(
      {},
      { $setOnInsert: { siteEnabled: false } },
      { new: true, upsert: true }).select('-__v -_id -createdAt -updatedAt');
  res.json(data);
});

settingsRouter.put('/', async (req, res) => {
  await SettingsModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json({ message: 'Settings updated' });
});
