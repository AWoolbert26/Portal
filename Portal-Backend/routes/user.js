import express from "express";

import {
  getUserFromToken,
  checkUniqueEmail,
  checkUniqueUsername,
  login,
  register,
  updateUserType,
  getUserFromId,
  searchUsers,
  checkFollowingUser,
  toggleFollowUser,
  getTopUsers,
  getMessagedUsers,
  getUserWithPosts,
} from "../controllers/user.js";

//creates modular, mini-routers that can be plugged into the main Express app using app.use() in index.js
export const userRoutes = express.Router();

//USER
userRoutes.post("/checkUniqueEmail", checkUniqueEmail);
userRoutes.post("/checkUniqueUsername", checkUniqueUsername);
userRoutes.post("/login", login);
userRoutes.post("/register", register);
userRoutes.patch("/updateUserType", updateUserType);
userRoutes.get("/users/:userId", getUserFromId);
userRoutes.get("/searchUsers", searchUsers);
userRoutes.get("/checkFollowing/:userId", checkFollowingUser);
userRoutes.get("/toggleFollow/:userId", toggleFollowUser);
userRoutes.get("/getTopUsers", getTopUsers);
userRoutes.get("/messagedUsers", getMessagedUsers);
userRoutes.get("/getUserWithPosts/:userId", getUserWithPosts);
