import express from "express";

import {
  getAverageCategoryRating,
  getCategories,
  getCategorySummary,
  getUserRatingOfCategory,
  rateCategory,
  selectCategories,
} from "../controllers/categories.js";

//creates modular, mini-routers that can be plugged into the main Express app using app.use() in index.js
export const categoryRoutes = express.Router();

//CATEGORIES
categoryRoutes.get("/getCategorySummary", getCategorySummary);
categoryRoutes.get("/getCategories", getCategories);
categoryRoutes.post("/selectCategories", selectCategories);
categoryRoutes.post("/rateCategory", rateCategory);
categoryRoutes.get(
  "/getAverageCategoryRating/:category",
  getAverageCategoryRating
);
categoryRoutes.get("/getUserRating/:category", getUserRatingOfCategory);
