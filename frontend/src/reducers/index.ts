import { combineReducers } from "redux";
import login from "./login";
import tokens from "./tokens"
import streaks from "./streaks";

const rootReducer = combineReducers({
    login,
    tokens,
    streaks,
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;