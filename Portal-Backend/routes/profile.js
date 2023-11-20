import express from "express";

import {
  getOtherProfileFromId,
  getOtherProfilePictureFromId,
  getProfileInformation,
  getProfilePicture,
  myProfile,
  setProfileInformation,
  uploadProfilePicture,
} from "../controllers/profile.js";

export const profileRoutes = express.Router();

//PROFILES
profileRoutes.get("/myProfile", myProfile);
profileRoutes.get("/getOtherProfile/:userId", getOtherProfileFromId);
profileRoutes.post("/uploadProfilePicture", uploadProfilePicture);
//why do we have these when we can just send over the profile picture
//with the original request?
profileRoutes.get("/getProfilePicture", getProfilePicture);
profileRoutes.get(
  "/getOtherProfilePicture/:userId",
  getOtherProfilePictureFromId
);
profileRoutes.post("/setProfileInformation", setProfileInformation);
profileRoutes.get("/getProfileInformation", getProfileInformation);
