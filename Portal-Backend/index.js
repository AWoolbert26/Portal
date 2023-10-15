import { PrismaClient } from "@prisma/client";
import express from "express";
const prisma = new PrismaClient();
import ngrok from "ngrok";
import jsonwebtoken from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
import cors from "cors";

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

import { S3Client } from "@aws-sdk/client-s3";

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
    const user = getUserFromToken(req.headers.authorization);
    console.log(req.body);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        type: req.body.type,
      },
    });
    res.status(200);
    res.send("Success");
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.post("/selectInterests", async (req, res) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const body = Object.keys(req.body).map((id) => ({ id: parseInt(id) })); // {id: name, id: name}
    console.log(body);
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

app.get("/getInterests", async (req, res) => {
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

    console.log(result);
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

    if (video !== "null" && video !== null) {
      const videoBuffer = Buffer.from(await video.data);

      console.log("Buffer conversion passed");

      const post = await prisma.post.create({
        data: {
          userId: user.id,
          description: description + ".",
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

      await prisma.post.update({
        where: { id: post.id },
        data: {
          url: `${process.env.S3_DOMAIN}/videos/${post.id}.${fileExtension}`,
        },
      });
      const command = new PutObjectCommand(commandParams);

      const s3response = await s3Client.send(command);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
