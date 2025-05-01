import express from "express";
const router = express.Router();

import { Request, Response } from "express";
import User from "../models/user.js";
import { getLucky7 } from "../cache/lucky7Cache.js";
import { addTimestampToUserWagers, getUserByEmail } from "../cache/usersCache.js";
import { UserDocument } from "../types/index.js";
import { isWithinTenSeconds, performLucky7Evaluation } from "../utils/lucky7.js";


type Lucky7Request = {
  tokens: number;
  email: string;
  isLucky7: boolean;
}

const updateUserTokens = async (email: string, tokens: number ) => {
  const updated = await User.findOneAndUpdate(
    { email },
    { $set: { tokens } },
    { 
      new: true,
      runValidators: true, 
      useFindAndModify: false, 
    }
  );

  if (!updated) {
    throw new Error(`No user found with email: ${email}`);
  }

  return updated;

}

const playLucky7 = async (req: Request, res: Response) => {
  const { tokens, email, isLucky7 }: Lucky7Request = req.body;
  const roll = getLucky7();

  const currentTimestamp = Date.now();

  if(!isWithinTenSeconds(roll.timestamp, currentTimestamp)) {
    console.log("Cannot wager. Please wait until next roll.")
    return res.status(200).json({ message: "Cannot wager. Please wait until next roll" });
  }


  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    if(existingUser?.tokens < tokens) {
      console.log("Not enough tokens.")
      return res.status(200).json({ message: "Not enough tokens.", wageAccepted: false });
    }

    const timeStampIsValid = addTimestampToUserWagers(email, roll.timestamp);

    if(!timeStampIsValid){
      console.log("Cannot wager on this roll again");
      return res.status(200).json({ message: "Cannot wager on this roll again.", wageAccepted: false });
    }

    let initialTokens = existingUser.tokens;

    existingUser.tokens = existingUser.tokens - tokens;
    updateUserTokens(email, existingUser.tokens);

    let newTokenOffset = performLucky7Evaluation(roll, tokens, isLucky7);

    if(newTokenOffset) {
      existingUser.tokens += newTokenOffset;
      updateUserTokens(email, existingUser.tokens);
    }

    console.log({ 
      initialTokens,
      tokensWagered: tokens,
      newTokenOffset,
      total: existingUser.tokens,
      roll
    });
    
    return res.status(200).json({ email, ...roll , wageAccepted: true, payout: newTokenOffset > 0});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

router.post("/play", playLucky7);


export default router;
