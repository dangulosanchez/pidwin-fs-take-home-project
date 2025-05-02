// Types
import { Lucky7RollResult } from "../types/lucky7.js";

// Inclusive whole number random function as per Stack overflow
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function isWithinTenSeconds(firstTs: number, secondTs: number): boolean {
    const diff = secondTs - firstTs;
    return diff > 0 && diff < 10_000;
  }

const lucky7Roll = () : Lucky7RollResult => {
    const dice = [getRandomInt(1, 6), getRandomInt(1, 6)];
    return {
        dice,
        isLucky7: dice[0] + dice[1] === 7,
        timestamp: Date.now(),
    }
}

const performLucky7Evaluation = (result: Lucky7RollResult, tokensWagered: number, isLucky7WagerState: boolean) => {
    if(result.isLucky7 !== isLucky7WagerState) {
        return 0;
    }
    if(isLucky7WagerState) {
        return tokensWagered * 7;
    }
    return tokensWagered;
}

export {
    isWithinTenSeconds,
    lucky7Roll,
    performLucky7Evaluation
}