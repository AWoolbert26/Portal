import { prisma } from "../index.js";
import { getUserFromToken } from "./user.js";

export const comment = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const { newComment, postId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        User: { connect: { id: userId } },
        Post: { connect: { id: postId } },
        comment: newComment,
      },
    });

    const username = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });

    res.send({
      ...comment,
      User: username,
      isLiked: false,
      likeCount: 0,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const getComments = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const postId = parseInt(req.params.postId);

    const commentsInfo = {};

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        User: {
          select: {
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    for (const comment of comments) {
      const likesCount = await prisma.commentLike.count({
        where: { commentId: comment.id },
      });
      const userLiked = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: userId,
            commentId: comment.id,
          },
        },
      });
      commentsInfo[comment.id] = {
        ...comment,
        likeCount: likesCount,
        isLiked: userLiked !== null,
      };
    }
    console.log(commentsInfo);
    res.send(commentsInfo);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const likeComment = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const commentId = parseInt(req.params.commentId);
    const liked = await prisma.commentLike.create({
      data: {
        User: { connect: { id: userId } },
        Comment: { connect: { id: commentId } },
      },
    });
    liked ? res.send(true) : res.send(false);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const commentId = parseInt(req.params.commentId);

    const deleted = await prisma.commentLike.delete({
      where: { userId_commentId: { userId: userId, commentId: commentId } },
    });
    deleted ? res.send(false) : res.send(true);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
