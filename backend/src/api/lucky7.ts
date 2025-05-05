// Libraries
import express from "express";
import { Request, Response } from "express";
// Cache utils
import { addWagerToQueue, get5PreviousRolls, getLucky7 } from "../cache/lucky7Cache.js";
import { addTimestampToUserWagers, getUserByEmail } from "../cache/usersCache.js";
// Functions
import { isWithinTenSeconds, lucky7Roll, updateUserTokens } from "../utils/lucky7.js";

const router = express.Router();

type Lucky7Request = {
  tokens: number;
  email: string;
  isLucky7: boolean;
}


const playLucky7 = async (req: Request, res: Response) => {
  const { tokens, email, isLucky7 }: Lucky7Request = req.body;
  const roll = getLucky7();

  const currentTimestamp = Date.now();

  if(!isWithinTenSeconds(roll.timestamp, currentTimestamp)) {
    return res.status(200).json({ message: "Cannot wager. Please wait until next roll" });
  }


  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    if(existingUser?.tokens < tokens) {
      return res.status(200).json({ message: "Not enough tokens.", wageAccepted: false });
    }

    const timeStampIsValid = addTimestampToUserWagers(email, roll.timestamp);

    if(!timeStampIsValid){
      return res.status(200).json({ message: "Cannot wager on this roll again.", wageAccepted: false });
    }

    existingUser.tokens = existingUser.tokens - tokens;
    await updateUserTokens(email, existingUser.tokens);

    addWagerToQueue(existingUser, tokens, isLucky7);

    return res.status(200).json({
      email,
      wageAccepted: true,
      tokens: tokens,
      streak: 123
    })

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const startLucky7 = async (req: Request, res: Response) => {
  const rolls = get5PreviousRolls();
  return res.status(200).json({
    rolls
  })
}

router.post("/play", playLucky7);
router.post("/start", startLucky7);


export default router;
