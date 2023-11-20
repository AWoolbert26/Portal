import express from "express";

import {
  comment,
  getComments,
  likeComment,
  unlikeComment,
} from "../controllers/comment.js";

//creates modular, mini-routers that can be plugged into the main Express app using app.use() in index.js
export const commentRoutes = express.Router();

//COMMENT
commentRoutes.post("/comment", comment);
commentRoutes.post("/getComments/:postId", getComments);
commentRoutes.post("/likeComment/:commentId", likeComment);
commentRoutes.delete("/unlikeComment/:commentId", unlikeComment);
