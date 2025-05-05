import { SET_STREAKS } from '../constants/actionTypes';

export const setStreaks = (amount: number) => ({
  type: SET_STREAKS,
  payload: amount,
});