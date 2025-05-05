// Libraries
import { Request, Response } from "express";
// Models
import WinStreakModel from "../models/win-streaks.js";
import { WinStreak } from "../types/index.js";
import { addNewStreaks, getLongestWinStreaks } from "../cache/winStreaks.js";


const find10LongestWinStreaks = async () => {
    const streaks = await WinStreakModel.find({}).sort({ streak: -1}).limit(10);
    return streaks;
}

const get10LongestWinStreaks = (req: Request, res: Response) => {
    try {
        const streaks = getLongestWinStreaks();
        return res.status(200).json({  streaks });
    }
    catch {
        return res.status(404).json({ message: "Win streaks not found "});
    }
    
}

const getLongestStreaksAnalysis = (longestWinstreaks: WinStreak[], currentStreaks: WinStreak[], invalidatedUserEmails: string[]) => {
    const meta = { 
        minimum : longestWinstreaks?.[0]?.streak ?? 0, 
        ids: [longestWinstreaks[0]._id],
        broadcast: false
    };

    for(let i = 1; i < longestWinstreaks.length; i++){
        const streak = longestWinstreaks[i];
        if(streak.streak < meta.minimum) { 
            meta.minimum = streak.streak;
        }
        meta.ids.push(streak._id);
    }
    currentStreaks.forEach((streak) => {
        if(meta.ids.includes(streak._id)){
            meta.broadcast = true;
        }
    })
    if(longestWinstreaks.length < 10){
        meta.minimum = 0;
    }
    const newStreaks = currentStreaks.filter((streak) => streak.streak > meta.minimum)
        .filter((streak) => !meta.ids.includes(streak._id));
    if(newStreaks.length) {
        meta.broadcast = true;
        addNewStreaks(newStreaks);
    }

    invalidatedUserEmails.forEach((email) => {
        let activeUserStreak = longestWinstreaks.find((streak) => streak.email === email && streak.active);
        if (activeUserStreak) {
            activeUserStreak.active = false;
            meta.broadcast = true;
        }
    })
    return meta;

}

export { find10LongestWinStreaks, get10LongestWinStreaks, getLongestStreaksAnalysis }