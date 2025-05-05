import { SET_STREAKS, SET_TOKENS } from '../constants/actionTypes';

export const setTokens = (amount: number) => ({
  type: SET_TOKENS,
  payload: amount,
});

export const setStreaks = (amount: number) => ({
  type: SET_STREAKS,
  payload: amount
})