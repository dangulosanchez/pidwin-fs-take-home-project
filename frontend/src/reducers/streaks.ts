import { SET_STREAKS } from '../constants/actionTypes';
import { StreaksState, StreaksAction } from '../types/actionTypes';

const initialState: StreaksState = { value: null };

const streaksReducer = (
  state: StreaksState = initialState,
  action: StreaksAction
): StreaksState => {
  switch (action.type) {
    case SET_STREAKS:
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default streaksReducer;
