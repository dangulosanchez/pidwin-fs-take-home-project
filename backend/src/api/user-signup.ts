// Libraries
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Models
import User from "../models/user.js";
// Types
import { SignupRequest } from "../types/index.js";
// Functions
import { initializeUserWithTokens } from "../utils/tokens.js";

const  signup = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, firstName, lastName }: SignupRequest = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Does Not Match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userObject = initializeUserWithTokens({email, password: hashedPassword, name: `${firstName} ${lastName}`, tokens: 0});
    const result = await User.create(userObject);
    
    const token = jwt.sign(
      {
        _id: result._id,
        name: result.name,
        email: result.email,
        password: result.password,
        tokens: result.tokens,
      },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default signup;