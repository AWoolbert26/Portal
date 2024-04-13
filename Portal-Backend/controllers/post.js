import { prisma } from "../index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../index.js";
import { getUserFromToken, getUser, getFollows } from "./user.js";

export const getPosts = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const category = req.query.category;
    // could make it where every post has a "Home" category to get rid of the if else
    if (category == "Home") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              user: {
                id: user.id,
              },
            },
            {
              user: {
                followers: {
                  some: {
                    followerId: user.id,
                  },
                },
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              username: true,
              profilePicture: true,
              id: true,
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.send(posts);
    } else {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              user: {
                id: user.id,
              },
            },
            {
              user: {
                followers: {
                  some: {
                    followerId: user.id,
                  },
                },
              },
            },
          ],
          categories: {
            some: {
              name: category,
            },
          },
        },
        include: {
          user: {
            select: {
              username: true,
              profilePicture: true,
              id: true,
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.send(posts);
    }
  } catch (err) {
    res.send(err);
  }
};

export const post = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const video = req.files.video;
    const description = req.body.description;
    const categories = Object.keys(JSON.parse(req.body.categories)).map(
      (id) => ({ id: parseInt(id) })
    );

    if (video !== "null" && video !== null) {
      const videoBuffer = Buffer.from(await video.data);

      console.log("Buffer conversion passed");

      console.log(user)
      console.log(categories)
      console.log(description)

      const post = await prisma.post.create({
        data: {
          userId: user.id,
          description: description,
          categories: { connect: categories },
        },
        select: {
          id: true,
        },
      });

      const fileExtension = "mov"; //change this to match whatever the file extension is

      //upload videoBlob to s3 to the videos folder
      const commandParams = {
        Key: `videos/${post.id}.${fileExtension}`, //for other video types, adjust by sending proper type to backend
        Bucket: "portal-posts",
        Body: videoBuffer,
        //setting cache to 1 minute
        Metadata: {
          "Cache-Control": "max-age=60",
        },
      };

      const command = new PutObjectCommand(commandParams);

      const s3response = await s3Client.send(command);

      await prisma.post.update({
        where: { id: post.id },
        data: {
          url: `http://portal-posts.s3.us-east-2.amazonaws.com/videos/${post.id}.${fileExtension}`,
        },
      });

      console.log("Successfully uploaded");

      //set video in prisma post object
      //create prisma post and get back id
      // const videoUrl =
      //   process.env.CDN_DOMAIN + "videos/" + video.id + "." + fileExtension;

      res.send("Success");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending post request")
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const userId = user.id;
    const posts = await prisma.post.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
            id: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(posts);
  } catch (err) {
    res.send(err);
  }
};

export const getPostInfo = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const postId = parseInt(req.params.postId);

    const getIsLiked = await prisma.like.findUnique({
      where: { userId_postId: { userId: userId, postId: postId } },
    });

    const isLiked = getIsLiked !== null;

    const likeCount = await prisma.like.count({
      where: { postId: postId },
    });

    const commentCount = await prisma.comment.count({
      where: { postId: postId },
    });

    res.send({
      isLiked: isLiked,
      likeCount: likeCount,
      commentCount: commentCount,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const postId = parseInt(req.params.postId);
    const liked = await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    liked ? res.send(true) : res.send(false);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const postId = parseInt(req.params.postId);

    const deleted = await prisma.like.delete({
      where: { userId_postId: { userId: userId, postId: postId } },
    });
    deleted ? res.send(false) : res.send(true);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
