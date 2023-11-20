/* The controllers are nothing but the code 
which is going to execute when a client accesses some route. 
This code can consist of several lines that’s 
why we separate it from routes files. */

import { prisma } from "../index.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUser = async (id) => {
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

export const getUserFromToken = (token) => {
  const user = jsonwebtoken.verify(token, "secret");
  return user.data;
};

export const getFollows = async (followerId, followeeId) => {
  const follows = await prisma.follow.findFirst({
    where: {
      followeeId: followeeId,
      followerId: followerId,
    },
  });
  return follows ? true : false;
};

export const checkUniqueEmail = async (req, res) => {
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
};

export const checkUniqueUsername = async (req, res) => {
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
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: email },
    });
    bcrypt.compare(password, user.password, function (err, result) {
      // result === true -> hashed password is correct
      if (result) {
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
      } else {
        res.status(500);
        res.send(new Error("Incorrect password"));
      }
    });
  } catch (err) {
    res.status(500);
    res.send(err);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        // creates user and stores hashed password.
        const newUser = await prisma.user.create({
          data: {
            email: email,
            password: hash,
            username: username,
          },
        });

        //creates profile
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

        //generates jwt
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

          //sends response
          res.send({
            authToken: token,
            user: { id: newUser.id, type: newUser.type },
          });
        }
      });
    });

    // res.status(200); // 200 for success
    // res.send(`New user ${newUser.username} created!`);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

export const updateUserType = async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
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
    const decodedToken = jsonwebtoken.verify(oldToken, "secret");
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
};

export const getUserFromId = async (req, res) => {
  try {
    const user = getUser(req.params.id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
};

export const searchUsers = async (req, res) => {
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
};

//i think this is a duplicate of getFollows
export const checkFollowingUser = async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    const follows = await getFollows(user.id, parseInt(req.params.userId));
    res.send(follows);
  } catch (err) {
    res.send(err);
  }
};

export const toggleFollowUser = async (req, res) => {
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
};

export const getTopUsers = async (req, res) => {
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
};

export const getMessagedUsers = async (req, res) => {
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
};

export const getUserWithPosts = async (req, res) => {
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
};
