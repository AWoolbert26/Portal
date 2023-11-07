import { PrismaClient } from "@prisma/client";
import express from "express";
const prisma = new PrismaClient();
import ngrok from "ngrok";
import jsonwebtoken from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
import cors from "cors";
import { S3Client } from "@aws-sdk/client-s3";
import { connect } from "http2";
import * as http from "http";

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

// const globalForS3 = globalThis

const s3Client =
  //   globalForS3.s3Client ??
  new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

// if (process.env.NODE_ENV !== "production") globalForS3.s3Client = s3Client;

const getUserFromToken = (token) => {
  const user = jsonwebtoken.verify(token, "secret");
  return user.data;
};

//checking if email is unique
app.post("/checkUniqueEmail", async (req, res) => {
  try {
    const body = req.body;
    const user = await prisma.user.findFirst({
      where: { email: body.email },
    });

    res.send(user == null ? "0" : "Email is already taken"); //0 for success, 1 for email taken
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//checking if username is unique
app.post("/checkUniqueUsername", async (req, res) => {
  try {
    const body = req.body;

    const user = await prisma.user.findFirst({
      where: { username: body.username },
    });

    res.send(user == null ? "0" : "Username is already taken"); //0 for success, 1 for email taken
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: email, password: password },
    });

    if (user != null) {
      const token = jsonwebtoken.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            id: user.id,
            type: user.type,
            email: user.email,
            username: user.username,
          },
        },
        "secret"
      );
      res.send({
        authToken: token,
        user: { id: user.id, type: user.type },
      });
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//register
app.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: password,
        username: username,
      },
    });

    await prisma.profile.create({
      data: {
        name: "Not Set",
        bio: "Not Set",
        location: "Not Set",
        occupation: "Not Set",
        id: newUser.id,
        userId: newUser.id,
      },
    });

    if (newUser != null) {
      const token = jsonwebtoken.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            id: newUser.id,
            type: newUser.type,
            email: newUser.email,
            username: newUser.username,
          },
        },
        "secret"
      );

      res.send({
        authToken: token,
        user: { id: newUser.id, type: newUser.type },
      });
    }

    // res.status(200); // 200 for success
    // res.send(`New user ${newUser.username} created!`);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

//change user type
app.patch("/updateUserType", async (req, res) => {
  try {
    var user = getUserFromToken(req.headers.authorization);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        type: req.body.type,
      },
    });

    user.type = req.body.type;

    // dont know if it works security wise because the previous token is still active
    // will look into blacklisting later
    // could also make the register web token only last for a few seconds
    const oldToken = req.headers.authorization;
    var decodedToken = jsonwebtoken.verify(oldToken, "secret");
    decodedToken.data.type = req.body.type;

    const newToken = jsonwebtoken.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: decodedToken.data },
      "secret"
    );

    res.status(200);
    res.send({ authToken: newToken, msg: "Success", user: user });
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.post("/selectCategories", async (req, res) => {
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
});

const getUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

app.get("/myProfile", async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const user = getUser(req.params.id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

// what if they dont have profile?
app.get("/getOtherProfile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await prisma.profile.findFirst({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            profilePicture: true,
          },
        },
      },
    });
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.get("/getCategories", async (req, res) => {
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
});

app.post("/post", async (req, res) => {
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
        Bucket: "portal-437",
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
          url: `${process.env.S3_DOMAIN}/videos/${post.id}.${fileExtension}`,
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
  }
});

app.post("/uploadProfilePicture", async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const image = req.files.profilePicture;

    if (image !== null) {
      const imageBuffer = Buffer.from(await image.data);
      const fileExtension = "jpg"; // Change this to match the actual file extension

      const commandParams = {
        Key: `profilePictures/${user.id}.${fileExtension}`, // Unique key for the image
        Bucket: "portal-437",
        Body: imageBuffer,
        Metadata: {
          "Cache-Control": "max-age=60",
        },
      };
      const s3Response = await s3Client.send(
        new PutObjectCommand(commandParams)
      );
      const imageUrl = `${process.env.S3_DOMAIN}/profilePictures/${user.id}.${fileExtension}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePicture: imageUrl },
      });

      console.log("Profile picture uploaded successfully");
      res.send("Success");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/getProfilePicture", async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const userId = user.id;
    const profilePicture = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profilePicture: true,
      },
    });
    res.send(profilePicture);
  } catch (e) {
    res.send(e);
  }
});

app.get("/getOtherProfilePicture/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const profilePicture = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        profilePicture: true,
      },
    });
    res.send(profilePicture);
  } catch (e) {
    throw e;
  }
});

app.post("/setProfileInformation", async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);

    const profileAlreadyExists = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profileAlreadyExists) {
      try {
        await prisma.profile.update({
          where: {
            userId: user.id,
          },
          data: {
            name: req.body.name,
            location: req.body.location,
            occupation: req.body.occupation,
            bio: req.body.bio,
          },
        });
        res.send("Success");
      } catch (err) {
        throw err;
      }
    } else {
      const newProfile = await prisma.profile.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          name: req.body.name,
          location: req.body.location,
          occupation: req.body.occupation,
          bio: req.body.bio,
        },
      });
      res.send(newProfile);
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/getProfileInformation", async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req.headers.authorization);
    const user = await getUser(tokenUser.id);
    const profile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    // //send whether they follow in this
    // const follows = await getFollows(user, profile.userId);
    // profile["follows"] = follows ? true : false;

    res.send(profile);
  } catch (err) {
    res.send(err);
  }
});

// deserializes, supplying single string for common traits and hard values that should be seperated by ','
app.get("/getCategorySummary", async (req, res) => {
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
});

app.get("/getPosts", async (req, res) => {
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
});

app.get("/getUserPosts", async (req, res) => {
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
});

app.get("/searchUsers", async (req, res) => {
  const currentUser = getUserFromToken(req.headers.authorization);
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: req.query.username,
          not: currentUser.username,
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

const getFollows = async (followerId, followeeId) => {
  const follows = await prisma.follow.findFirst({
    where: {
      followeeId: followeeId,
      followerId: followerId,
    },
  });
  return follows ? true : false;
};

app.get("/checkFollowing/:userId", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    const follows = await getFollows(user.id, parseInt(req.params.userId));
    res.send(follows);
  } catch (err) {
    res.send(err);
  }
});

app.get("/toggleFollow/:userId", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    console.log(user);

    const follows = await getFollows(user.id, parseInt(req.params.userId));
    console.log(follows);

    if (follows) {
      await prisma.follow.delete({
        where: {
          followerId_followeeId: {
            followerId: user.id,
            followeeId: parseInt(req.params.userId),
          },
        },
      });
      res.send({ follows: false });
    } else {
      await prisma.follow.create({
        data: {
          followeeId: parseInt(req.params.userId),
          followerId: user.id,
        },
      });
      res.send({ follows: true }); //1 for follows
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/getPostInfo/:postId", async (req, res) => {
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
});

app.post("/likePost/:postId", async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;
    const postId = parseInt(req.params.postId);
    const liked = await prisma.like.create({
      data: {
        User: { connect: { id: userId } },
        Post: { connect: { id: postId } },
      },
    });
    liked ? res.send(true) : res.send(false);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.delete("/unlikePost/:postId", async (req, res) => {
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
});

app.post("/comment", async (req, res) => {
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
});

app.post("/getComments/:postId", async (req, res) => {
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
});

app.post("/likeComment/:commentId", async (req, res) => {
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
});

app.delete("/unlikeComment/:commentId", async (req, res) => {
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
});

app.get("/getTopUsers", async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers.authorization).id;

    // to make more efficient we should have a post count variable i think
    const usersWithPosts = await prisma.user.findMany({
      where: {
        posts: {
          some: {},
        },
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        posts: true,
      },
    });

    usersWithPosts.sort((a, b) => b.posts.length - a.posts.length);

    const topUsers = usersWithPosts.splice(0, 3);

    res.send(topUsers);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/messages/:userId", async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: parseInt(req.params.userId),
          },
          {
            receiverId: user.id,
            senderId: parseInt(req.params.userId),
          },
        ],
      },
    });
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/messagedUsers", async (req, res) => {
  try {
    const authUser = getUserFromToken(req.headers.authorization);
    const usersMessaged = await prisma.user.findMany({
      where: {
        OR: [
          {
            receivedMessages: {
              some: {
                senderId: authUser.id,
              },
            },
          },
          {
            sentMessages: {
              some: {
                receiverId: authUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        profile: {
          select: {
            name: true,
          },
        },
      },
    });
    res.send(usersMessaged);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/getUserWithPosts/:userId", async (req, res) => {
  try {
    const authUser = getUserFromToken(req.headers.authorization);
    const profileWithPosts = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.userId),
      },
      select: {
        createdAt: true,
        id: true,
        posts: {
          include: {
            user: {
              select: {
                profilePicture: true,
                username: true,
                profile: true,
              },
            },
          },
        },
        _count: {
          select: { followers: true },
        },
        profile: true,
        profilePicture: true,
        type: true,
        username: true,
        categories: true,
      },
    });
    console.log(profileWithPosts);
    res.send(profileWithPosts);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//SOCKET
import { Server } from "socket.io";
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
