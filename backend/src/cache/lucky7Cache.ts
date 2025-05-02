// Functions
import { lucky7Roll } from "../utils/lucky7.js";
// Sockets
import { io } from "../../index.js";
// Types
import { Lucky7RollResult } from "../types/lucky7.js";

const REGEN_INTERVAL_MS = 15_000;
let currentLucky7 = lucky7Roll();  
let previousLuckyRoll = lucky7Roll();
let previousRolls: Lucky7RollResult[] = [];

setInterval(() => {
  try {
    previousRolls.push(previousLuckyRoll);
    previousRolls = previousRolls.slice(-5);
    currentLucky7 = lucky7Roll();
    console.log("Regenerated lucky7:", currentLucky7);
    io.emit("lucky7Socket", previousLuckyRoll);
    previousLuckyRoll = currentLucky7;
  } catch (err) {
    console.error("Failed to regenerate lucky7:", err);
  }
}, REGEN_INTERVAL_MS);

export function getLucky7() {
  return currentLucky7;
}

export function getPreviousRolls() {
  return previousRolls;
}
