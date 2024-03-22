/* The controllers are nothing but the code 
which is going to execute when a client accesses some route. 
This code can consist of several lines that’s 
why we separate it from routes files. */

import { prisma } from "../index.js";
import nodemailer from "nodemailer";
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
            user: { id: user.id, type: user.type, verified: user.verified },
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

export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = parseInt(req.query.id);
    const redirectUrl = req.query.redirectUrl;

    console.log(redirectUrl, userId);
    // return;
    const { email } = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    const serverIp = `${req.protocol}://${req.headers.host}`;

    console.log("Made IT!")
    sendVerificationEmail(userId, email, serverIp, redirectUrl);

    //generates jwt -- postponed to when they verify email
    res.status(200);
    res.send("Success!");
  } catch (err) {
    res.status(500);
    res.send(err);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    //handle case where token is expired
    const verifyToken = await req.params.token;
    const { id, redirectUrl } = jsonwebtoken.verify(verifyToken, "secret").data;
    console.log(id, redirectUrl);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        verified: true,
      },
    });

    // creates auth token
    if (user != null) {
      const authToken = jsonwebtoken.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            id: user.id,
            type: user.type,
            email: user.email,
            username: user.username,
            verified: user.verified,
          },
        },
        "secret"
      );

      //currently, the app is running at the same ip as the backend, but we will have to change this when we deploy
      res.redirect(`${redirectUrl}/${user.id}`);
    }
    // res.send({ msg: "Verification successful", redirectUrl: clientIp });
  } catch (err) {
    //redirect to failure page
    res.status(500);
    res.send(err);
  }
};

export const authenticate = async (req, res) => {
  try {
    //get user id
    const id = await req.params.id;
    const userId = parseInt(req.params.id);
    //get user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        type: true,
      },
    });

    //send authtoken and user if user exists
    if (user != null) {
      const token = jsonwebtoken.sign(
        {
          data: {
            id: user.id,
            type: user.type,
            email: user.email,
            username: user.username,
          },
        },
        "secret",
        { expiresIn: "60m" }
      );

      res.send({
        authToken: token,
        user: { id: user.id, type: user.type },
      });

      console.log("authorization complete");
    } else {
      console.log("auth broken");
      res.status(500);
      res.send("Couldn't authenticate");
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, redirectUrl, username } = await req.body;

    //first send email with auth token, which will confirm account creation and direct them to
    // profile initialization page

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

        const serverIp = `${req.protocol}://${req.headers.host}`;

        //verification email send
        sendVerificationEmail(newUser.id, email, serverIp, redirectUrl);

        //generates jwt -- postponed to when they verify email
        res.status(200);
        res.send({ userId: newUser.id });
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

//helpers
const sendVerificationEmail = (userId, email, serverIp, redirectUrl) => {
  try {
    console.log("Made IT 2")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SMTP port (465 for SSL)
      secure: true,
      auth: {
        user: "andrew.s.woolbert@gmail.com",
        pass: "xzic ppsm dato racw"
      },
    });

    console.log("Made IT 3")
    //creates token that encodes id and redirectUrl
    const verificationToken = jsonwebtoken.sign(
      {
        data: {
          id: userId,
          redirectUrl: redirectUrl,
        },
      },
      "secret",
      { expiresIn: "10m" }
    );

    console.log("Made IT 4")
    const mailConfigurations = {
      from: "andrew.s.woolbert@gmail.com",
      to: email,
      subject: "Portal - Email Verification",
      text: `Hi there! Please verify your email to continue using Portal! Here is the link for verification: ${serverIp}/verify/${verificationToken}.`,
      // html: {make html for the email}
    };

    console.log("Made IT 5")
    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) throw Error(error);
      console.log("Email Sent Successfully");
      console.log(info);
    });
  } catch (err) {
    console.log(err);
    throw err; // caught in register function
  }
};

//implement
const userIsVerified = (id) => {
  try {
    const user = prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        verified: true,
      },
    });

    return user.verified;
  } catch (err) {
    //catch this error in functions that call
    throw err;
  }
};
