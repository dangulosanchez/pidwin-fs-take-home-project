// Libraries
import { FilterQuery } from "mongoose";
// Models
import WinStreakModel from "../models/win-streaks.js";
// Types
import { UserDocument, WinStreak } from "../types/index.js";
import { io } from "../../index.js";
import { find10LongestWinStreaks, get10LongestWinStreaks } from "../utils/winStreaks.js";

const winStreaks: WinStreak[] = [];
let longestWinstreaks: WinStreak[] = [];
let winStreakId = 0;

const getUserWinStreak = async (user: UserDocument, defaultStreakValue?: number) => {
    const { email, name } = user;
    const findWinStreakInCache = winStreaks.find((streak) => streak.email === email);
    if(findWinStreakInCache){
        return findWinStreakInCache;
    }
    const findWinStreakInDb = await (WinStreakModel.findOne({email}) as FilterQuery<WinStreak>).lean();
    if(findWinStreakInDb){
        winStreaks.push(findWinStreakInDb);
        return findWinStreakInDb;
    }
    return await WinStreakModel.create({ email, name, streak: defaultStreakValue || 0, _id: String(winStreakId++)});
}


const updateWinStreak = async (email: string, streak: number ) => {
  const updated = await WinStreakModel.findOneAndUpdate(
    { email },
    { $set: { streak } },
    { 
      new: true,
      runValidators: true, 
      useFindAndModify: false, 
    }
  );

  if (!updated) {
    throw new Error(`No win streak found with email: ${email}`);
  }

  return updated;

}
const processUserWinStreak = async (user: UserDocument, success: boolean) => {
    const winStreak = await getUserWinStreak(user);
    if(!winStreak) { 
        return null;
    }
    if(!success){
        winStreak.streak = 0;
    }
    else {
        winStreak.streak++;
    }
    updateWinStreak(user.email, winStreak.streak);
    return winStreak.streak;
}

const initializeLongestWinStreaks = async () => {
  longestWinstreaks = await find10LongestWinStreaks();
  io.emit("winstreaksSocket", longestWinstreaks);
}

export {
    getUserWinStreak,
    initializeLongestWinStreaks,
    processUserWinStreak,
}