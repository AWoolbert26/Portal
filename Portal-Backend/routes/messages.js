import express from "express";

import { getConversation } from "../controllers/messages.js";

//creates modular, mini-routers that can be plugged into the main Express app using app.use() in index.js
export const messageRoutes = express.Router();

//MESSAGES
messageRoutes.get("/messages/:userId", getConversation);
