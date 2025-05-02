// Libraries
import { Request, Response } from "express";
// Models
import WinStreakModel from "../models/win-streaks.js";


const find10LongestWinStreaks = async () => {
    const streaks = await WinStreakModel.find({}).sort({ streak: -1}).limit(10);
    return streaks;
}

const get10LongestWinStreaks = async (req: Request, res: Response) => {
    try {
        const streaks = await find10LongestWinStreaks();
        return res.status(200).json({  streaks });
    }
    catch {
        return res.status(404).json({ message: "Win streaks not found "});
    }
    
}

export { find10LongestWinStreaks, get10LongestWinStreaks }