// Libraries
import { FilterQuery } from "mongoose";
// Models
import User from "../models/user.js";
// Types
import { UserDocument } from "../types/index.js";

const users: UserDocument[] = [];
const userWagerTimestamps : {email: string, timestamps: number[]}[] = [];

const getUserByEmail = async (email: string) => {
    const findUserInCache = users.find((user) => user.email === email);
    if(findUserInCache){
        return findUserInCache;
    }
    const findUserInDb = (User.findOne({email}) as FilterQuery<UserDocument>).lean();
    if(findUserInDb){
        const user : UserDocument = {
            email: String(findUserInDb.email),
            tokens: findUserInDb?.tokens,
            _id: findUserInDb._id,
            name: findUserInDb.name,
            password: findUserInDb.password
        }
        users.push(user);
        return findUserInDb;
    }
    return null;
}

const addTimestampToUserWagers = (email: string, timestamp: number) => {
    const findUserTimestamps = userWagerTimestamps.find((userTimestamp) => userTimestamp.email === email);
    if(!findUserTimestamps){
        userWagerTimestamps.push({
            email,
            timestamps: [timestamp]
        });
        return true;
    }
    const findWithinUserTimestamps = findUserTimestamps.timestamps.find((ts) => ts === timestamp);
    if(findWithinUserTimestamps){
        return false;
    }
    findUserTimestamps.timestamps.push(timestamp);
    return true;

}

export {
    addTimestampToUserWagers,
    getUserByEmail
}