import axios from "axios";
import { LoginFormData, SignupFormData, PasswordChangeFormData, Lucky7Data, StartLucky7Data } from "../types/actionTypes";

const API = axios.create({ baseURL: "http://localhost:5001" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${profile.token}`;
  }
  return req;
});

export const login = (formData: LoginFormData) => API.post("/api/user/login", formData);
export const signUp = (formData: SignupFormData) => API.post("/api/user/signup", formData);
export const changePassword = (formData: PasswordChangeFormData) =>
  API.post("/api/user/changePassword", formData);
export const playLucky7 = (formData : Lucky7Data) => API.post("/api/lucky7/play", formData);
export const startLucky7 = (formData : StartLucky7Data) => API.post("/api/lucky7/start", formData);
export const getWinStreaks = () => API.get("/api/winstreaks");