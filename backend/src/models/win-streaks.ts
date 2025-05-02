// Libaries
import mongoose, { Schema } from "mongoose";
// Types
import { WinStreak } from "../types/index.js";

interface WinStreakModel extends WinStreak {}

const WinStreakSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  _id: {type: String},
  streak: { type: Number, default: 0 },
  historic: {type: Boolean, default: false}
});

export default mongoose.model<WinStreakModel>("win_streaks", WinStreakSchema);