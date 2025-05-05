// Libraries
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Types
import { LoginRequest } from "../types/index.js";
// Cache utils
import { getUserByEmail } from "../cache/usersCache.js";
import { getUserActiveWinStreak } from "../cache/winStreaks.js";

const login = async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(404).json({ message: "User Does Not Exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const existingUserStreak = await getUserActiveWinStreak(existingUser);

    const token = jwt.sign(
      {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.password,
        tokens: existingUser.tokens,
        streak: existingUserStreak?.streak ?? 0,
      },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default login;