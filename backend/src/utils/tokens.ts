import { UserDocument } from "../types/index.js";

 const initializeUserWithTokens = (user: UserDocument, tokens?: number) => {
    if(!tokens){
        tokens = 100;
    }
    return {
        ...user,
        tokens,
    }
 }

 export {
    initializeUserWithTokens
 }