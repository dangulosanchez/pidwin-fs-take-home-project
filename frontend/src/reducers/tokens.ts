import { SET_TOKENS } from '../constants/actionTypes';
import { TokenState, TokenAction } from '../types/actionTypes';

const initialState: TokenState = { value: null };

const tokensReducer = (
  state: TokenState = initialState,
  action: TokenAction
): TokenState => {
  switch (action.type) {
    case SET_TOKENS:
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default tokensReducer;
