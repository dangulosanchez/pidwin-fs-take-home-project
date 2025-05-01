import { lucky7Roll } from "../utils/lucky7.js";
import { io } from "../../index.js"
import { Lucky7RollResult } from "../types/lucky7.js";

const REGEN_INTERVAL_MS = 15_000;
let currentLucky7 = lucky7Roll();  

setInterval(() => {
  try {
    currentLucky7 = lucky7Roll();
    console.log("Regenerated lucky7:", currentLucky7);
    io.emit("lucky7Socket", currentLucky7);
  } catch (err) {
    console.error("Failed to regenerate lucky7:", err);
  }
}, REGEN_INTERVAL_MS);

export function getLucky7() {
  return currentLucky7;
}
