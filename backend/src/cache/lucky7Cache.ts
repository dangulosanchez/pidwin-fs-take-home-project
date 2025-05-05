// Functions
import { lucky7Roll, performLucky7Evaluation, updateUserTokens } from "../utils/lucky7.js";
// Sockets
import { io } from "../../index.js";
// Types
import { Lucky7RollResult } from "../types/lucky7.js";
import { UserDocument, WinStreak } from "../types/index.js";
import { processStreaksAfterWager, processUserWinStreak } from "./winStreaks.js";

const REGEN_INTERVAL_MS = 15_000;
let currentLucky7 = lucky7Roll();  
let previousLuckyRoll = lucky7Roll();
let previousRolls: Lucky7RollResult[] = [lucky7Roll(), lucky7Roll(), lucky7Roll(), lucky7Roll(), lucky7Roll()];

let wagersForPreviousRoll : { 
  user: UserDocument;
  isLucky7: Boolean;
  tokens: number;
}[] = [];


setInterval(() => {
  try {
    previousRolls.push(previousLuckyRoll);
    previousRolls = previousRolls.slice(-5);
    currentLucky7 = lucky7Roll();
    console.log("Regenerated lucky7:", currentLucky7);
    processUserWagers(previousLuckyRoll, [...wagersForPreviousRoll]);

    io.emit("lucky7Socket", previousRolls);
    previousLuckyRoll = currentLucky7;
    wagersForPreviousRoll = [];
  } catch (err) {
    console.error("Failed to regenerate lucky7:", err);
  }
}, REGEN_INTERVAL_MS);

async function processUserWagers(roll: Lucky7RollResult, wagers: typeof wagersForPreviousRoll){
  const updateUserTokenPromises : Promise<UserDocument>[]  = [];
  const failedWagerEmails: string[] = []

  wagers.forEach((wager) => {
    const { user, tokens, isLucky7 } = wager;
    let newTokenOffset = performLucky7Evaluation(roll, tokens, Boolean(isLucky7));
    user.tokens += newTokenOffset;
    if(!newTokenOffset){
      failedWagerEmails.push(user.email);
    }
    else { 
      io.to(user.email).emit("userWager", { message: "Success!", success: true, gain: newTokenOffset})
    }
    updateUserTokenPromises.push(updateUserTokens(user.email, user.tokens));
  })

  const updateUserWinStreakPromises: Promise<WinStreak | null>[] = [];
  await Promise.all(updateUserTokenPromises).then((users) => {
    users.forEach((user) => {
      updateUserWinStreakPromises.push(processUserWinStreak(user, !failedWagerEmails.includes(user.email)));
    });
  });

  await Promise.all(updateUserWinStreakPromises).then((streaks) => {
    streaks.forEach((streak) => {
      if(streak) { 
        io.to(streak.email).emit("userStreak", { streak : streak.streak});
      }
    })
  })


  failedWagerEmails.forEach((email) => {
    io.to(email).emit("userStreak", { streak : 0});
    io.to(email).emit("userWager", { message: "Sorry! Please try again.", success: false, gain: 0})
  })

  processStreaksAfterWager(failedWagerEmails);
  
}

function getLucky7() {
  return currentLucky7;
}

function getPreviousRolls() {
  return previousRolls;
}

function addWagerToQueue(user: UserDocument, tokensWagered: number, isLucky7: boolean){
  wagersForPreviousRoll.push({
    user,
    isLucky7,
    tokens: tokensWagered,
  })
}

function get5PreviousRolls(){
  return previousRolls;
}

export { 
  addWagerToQueue,
  get5PreviousRolls,
  getLucky7,
  getPreviousRolls
}