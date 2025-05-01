// Libraries
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import http from 'http';


// Routes
import userRouter from "./src/api/user.js";
import lucky7Router from "./src/api/lucky7.js"


dotenv.config();

const app: Express = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("lucky7Socket", (data) => {
    console.log("test data", data);
    io.emit("lucky7Socket", data);
  })
});

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/lucky7", lucky7Router)

const PORT: string | number = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URL || '')
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.log(error.message));

  process.on("SIGINT", () => {
    process.exit(0);
  });

  server.listen(3001, () => {
    console.log('listening on *:3001');
  });

  export {
    io
  }