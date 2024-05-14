import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from "@prisma/client";
import express from "express";

import ngrok from "ngrok";
import jsonwebtoken from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
import cors from "cors";
import { S3Client } from "@aws-sdk/client-s3";
import { connect } from "http2";
import * as http from "http";

// route imports
import { userRoutes } from "./routes/user.js";
import { getUserFromToken } from "./controllers/user.js";

const app = express();
const port = 3000;
app.use(express.json()); //middleware to interpret all request body as json
// const url = await ngrok.connect(3000); //tunnel for backend requests
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use(cors());

export const prisma = new PrismaClient();

export const s3Client =
  new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: 'AKIAXYKJQL3CLF7B576X',
      secretAccessKey: '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',
    },
  });

// if (process.env.NODE_ENV !== "production") globalForS3.s3Client = s3Client;

// uses all of the routes in routes/user.js
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", commentRoutes);
app.use("/", categoryRoutes);
app.use("/", messageRoutes);
app.use("/", postRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//SOCKET (ALSO SPLIT INTO SEPARATE FILES)
import { Server } from "socket.io";
import { profileRoutes } from "./routes/profile.js";
import { commentRoutes } from "./routes/comment.js";
import { categoryRoutes } from "./routes/categories.js";
import { messageRoutes } from "./routes/messages.js";
import { postRoutes } from "./routes/post.js";
const socketPort = 3001;
const socketApp = express();
// socketApp.use(express.urlencoded({ extended: true }));
socketApp.use(express.json());
socketApp.use(cors());
const server = http.createServer(socketApp);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(socketPort, () => {
  console.log(`Server listening on ${socketPort}`);
});

//for authorizing socket user by id
io.use((socket, next) => {
  console.log("authorized");
  const id = socket.handshake.auth.id;
  if (!id) {
    return next(new Error("invalid id"));
  }
  socket.id = id;
  next();
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // after a user connects, it will listen for messages
  socket.on("private message", async ({ content, to }) => {
    //create message in DB
    const newMsg = await prisma.message.create({
      data: {
        senderId: socket.id,
        receiverId: parseInt(to),
        text: content,
      },
      select: {
        id: true,
      },
    });

    //sending response back to sender
    socket.emit("private message", {
      senderId: socket.id,
      text: content,
      id: newMsg.id,
      createdAt: newMsg.createdAt,
    });
    //send response to receiver
    socket.to(parseInt(to)).emit("private message", {
      senderId: socket.id,
      id: newMsg.id,
      text: content,
      createdAt: newMsg.createdAt,
    });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
