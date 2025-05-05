// Libraries
import { FilterQuery } from "mongoose";
// Models
import WinStreakModel from "../models/win-streaks.js";
// Types
import { UserDocument, WinStreak } from "../types/index.js";
// Socks
import { io } from "../../index.js";
// Utils
import { find10LongestWinStreaks, getLongestStreaksAnalysis } from "../utils/winStreaks.js";
import { uuid } from "../utils/uuid.js";

const inactiveWinstreaks: WinStreak[] = [];
const activeWinStreaks: WinStreak[] = [];
let longestWinstreaks: WinStreak[] = [];

const getUserActiveWinStreak = async (user: UserDocument, defaultStreakValue?: number) : Promise<WinStreak> => {
    const { email, name } = user;
    const findWinStreakInCache = activeWinStreaks.find((streak) => streak.email === email);
    if(findWinStreakInCache){
        return findWinStreakInCache;
    }
    const findWinStreakInDb = await (WinStreakModel.findOne({email, active: true }) as FilterQuery<WinStreak>).lean();
    if(findWinStreakInDb){
      activeWinStreaks.push(findWinStreakInDb);
      return findWinStreakInDb;
    }
    const streak = {email, name, streak: defaultStreakValue || 0, _id: uuid(), active: true};
    return await WinStreakModel.create({ ...streak});
}

const updateStreak = async (streakId: string, streak: number, active: boolean) => {
 return await WinStreakModel.findOneAndUpdate(
    { _id: streakId },
    { $set: { streak, active } },
    { 
      new: true,
      runValidators: true, 
      useFindAndModify: false, 
    }).lean();
}

const updateWinStreak = async (email: string, streak: number, streakId: string ) : Promise<WinStreak | null> => {
  let active = true;
  let updated = null;
  const activeWinStreak = activeWinStreaks.find((streak) => streak.email === email);
  if (!streak) {
    active = false;
    if (activeWinStreak) {
      const indexOfActiveWinStreak = activeWinStreaks.indexOf(activeWinStreak);
      activeWinStreaks.splice(indexOfActiveWinStreak, 1);
      inactiveWinstreaks.push(activeWinStreak);
      return await updateStreak(streakId, activeWinStreak.streak, false);
    }
  }
  if(activeWinStreak) { 
    activeWinStreak.streak = streak;
  }

  const findInLongestWinStreaks = longestWinstreaks.find((findStreak) => findStreak._id === streakId);
  if (findInLongestWinStreaks) {
    findInLongestWinStreaks.streak = streak;
  }

  updated = await WinStreakModel.findOneAndUpdate(
    { _id: streakId },
    { $set: { streak, active } },
    { 
      new: true,
      runValidators: true, 
      useFindAndModify: false, 
    }
  ).lean();

  if (!updated) {
    throw new Error(`No win streak found with email: ${email}`);
  }

  return updated;
}

const processUserWinStreak = async (user: UserDocument, success: boolean) : Promise<WinStreak | null> => {
    const winStreak = await getUserActiveWinStreak(user);
    if(!winStreak) { 
        return null;
    }
    let streak = winStreak.streak;
    if(!success){
        streak = 0;
    }
    else {
        streak++;
    }
    return await updateWinStreak(user.email, streak, String(winStreak._id));;
}

const initializeLongestWinStreaks = async () => {
  longestWinstreaks = await find10LongestWinStreaks();
  io.emit("winstreaksSocket", longestWinstreaks);
}

const broadcastLongestWinstreaks = async () => {
  io.emit("winstreaksSocket", longestWinstreaks);
}

const processStreaksAfterWager = (failedWagerEmails: string[]) => {
  if(longestWinstreaks.length) {
    const analysis = getLongestStreaksAnalysis(longestWinstreaks, activeWinStreaks, failedWagerEmails);
    if(analysis.broadcast) {
      broadcastLongestWinstreaks();
    }
  }
}

const getLongestWinStreaks = () => {
  if(!longestWinstreaks.length){
    initializeLongestWinStreaks();
  }
  return longestWinstreaks;
}

const addNewStreaks = (newStreaks: WinStreak[]) => {
  if (newStreaks.length) {
    longestWinstreaks = longestWinstreaks.sort((a, b) => b.streak - a.streak);
    const toRemove = Math.max(0, longestWinstreaks.length + newStreaks.length - 10);

    if (toRemove > 10) {
      longestWinstreaks.splice(-toRemove);
    }

    longestWinstreaks.push(...newStreaks);
    longestWinstreaks.sort((a, b) => b.streak - a.streak);
  }
}

export {
    addNewStreaks,
    broadcastLongestWinstreaks,
    getUserActiveWinStreak,
    getLongestWinStreaks,
    initializeLongestWinStreaks,
    processUserWinStreak,
    processStreaksAfterWager,
}