import { prisma } from "../index.js";
import { getUserFromToken } from "./user.js";

export const getCategories = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const result = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        categories: true,
      },
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const selectCategories = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const body = Object.keys(req.body).map((id) => ({ id: parseInt(id) })); // {id: name, id: name}
    const result = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        categories: {
          connect: body,
        },
      },
    });
    res.send("Success");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const categoryName = req.query.name;
    const category = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });
    if (category) {
      const summary = await prisma.categorySummary.findUnique({
        where: {
          categoryId: category.id,
        },
      });
      if (summary) {
        res.send(summary);
      } else {
        res.status(404).send("Category summary not found");
      }
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const rateCategory = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const { category, rating } = req.body;

    const categoryId = await prisma.category.findFirst({
      where: {
        name: category,
      },
      select: {
        id: true,
      },
    });

    // Check if the user has already rated the category
    const existingUserRating = await prisma.userRating.findFirst({
      where: {
        userId: user.id,
        categoryId: categoryId.id,
      },
    });

    if (existingUserRating) {
      // If an existing rating is found, update the rating
      const updatedUserRating = await prisma.userRating.update({
        where: { id: existingUserRating.id },
        data: {
          rating: rating,
        },
      });
      res.send(updatedUserRating);
    } else {
      // If no existing rating is found, create a new rating
      const userRating = await prisma.userRating.create({
        data: {
          userId: user.id,
          categoryId: categoryId.id,
          rating: rating,
        },
      });
      res.send(userRating);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAverageCategoryRating = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const categoryId = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
      select: {
        id: true,
      },
    });
    const averageRating = await prisma.userRating.aggregate({
      where: {
        categoryId: categoryId.id,
      },
      _avg: {
        rating: true,
      },
    });

    res.send(averageRating._avg.rating.toString());
  } catch (err) {
    console.log(err);
  }
};

export const getUserRatingOfCategory = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const categoryName = req.params.category;

    const categoryId = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
      select: {
        id: true,
      },
    });

    const userRating = await prisma.userRating.findFirst({
      where: {
        userId: user.id,
        categoryId: categoryId.id,
      },
      select: {
        rating: true,
      },
    });

    if (!userRating) {
      res.status(404).send("User rating not found");
    } else {
      res.send(userRating);
    }
  } catch (err) {
    console.log(err);
  }
};
