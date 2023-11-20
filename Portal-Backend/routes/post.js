import express from "express";

import {
  getPostInfo,
  getPosts,
  getUserPosts,
  likePost,
  post,
  unlikePost,
} from "../controllers/post.js";

//creates modular, mini-routers that can be plugged into the main Express app using app.use() in index.js
export const postRoutes = express.Router();

//POSTS
postRoutes.post("/post", post);
postRoutes.get("/getPosts", getPosts);
postRoutes.get("/getUserPosts", getUserPosts);
postRoutes.get("/getPostInfo/:postId", getPostInfo);
postRoutes.post("/likePost/:postId", likePost);
postRoutes.delete("/unlikePost/:postId", unlikePost);
