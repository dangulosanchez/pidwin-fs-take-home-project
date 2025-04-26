import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import userRouter from "./src/api/user.js";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(cors());
app.use("/api/user", userRouter);

const PORT: string | number = process.env.PORT || 5001;
console.log({...process.env})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// mongoose
//   .connect(process.env.MONGODB_URL || '')
//   .then(() =>
//     app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
//   )
//   .catch((error) => console.log(error.message));