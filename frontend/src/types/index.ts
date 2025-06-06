import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  tokens: number;
  id?: string;
  streak?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface PasswordChangeRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface UserJwtPayload extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface Lucky7Response  {
  message?: boolean;
  email?: string;
  payout?: boolean;
  tokens?: number;
  timestamp?: number;
  dice?: number[];
  isLucky7?: boolean;
  wageAccepted?: boolean;
  streak?: number;
}

export interface LiveRolls {
  dice: number[];
  isLucky7: boolean;
  timestamp: number;
}

export interface LiveStreaks {
  _id: string;
  name: string;
  streak: number;
  active: boolean;
}
