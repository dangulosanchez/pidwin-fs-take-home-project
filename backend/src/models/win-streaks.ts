// Libaries
import mongoose, { Schema } from "mongoose";
// Types
import { WinStreak } from "../types/index.js";
import { uuid } from "../utils/uuid.js";

interface WinStreakModel extends WinStreak {}

const WinStreakSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  _id: {type: String, required: true, default: uuid()},
  streak: { type: Number, default: 0 },
  active: {type: Boolean, default: false}
});

export default mongoose.model<WinStreakModel>("win_streaks", WinStreakSchema);