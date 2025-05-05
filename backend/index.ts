// Libraries
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import http from 'http';
// Sockets
import { Server } from "socket.io";
//Initialization
import { initializeLongestWinStreaks } from "./src/cache/winStreaks.js";
// Routes
import userRouter from "./src/api/user.js";
import lucky7Router from "./src/api/lucky7.js"
import winStreaksRouter from "./src/api/winStreaks.js"

dotenv.config();

const app: Express = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

io.use((socket, next) => {
  const { email } = socket.handshake.auth as { email?: string };
  if (!email) {
    return next(new Error("Authentication error: email is required"));
  }
  socket.data.email = email;
  next();
});

io.on('connection', (socket) => {
  const email = socket.data.email as string;
  socket.join(email);

  socket.on("lucky7Socket", (data) => {
    io.emit("lucky7Socket", data);
  });

  socket.on("winstreaksSocket", (data) => {
    io.emit("winstreaksSocket", data);
  });

  socket.on("userTokens", (data) => {
    io.to(email).emit("userTokens", data);
  });

  socket.on("userWager", (data) => {
    io.to(email).emit("userWager", data);
  })

  socket.on('disconnect', (reason) => {
  });
});

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/lucky7", lucky7Router)
app.use("/api/winstreaks", winStreaksRouter);

const PORT: string | number = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URL || '')
  .then(() => {
    app.listen(PORT, async () =>
      {
        console.log(`Server listening on http://localhost:${PORT}`)
        await initializeLongestWinStreaks();
      }
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