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
    await prisma.user.update({
      where: { id: user.id },
      data: {
        type: req.body.type,
      },
    });
    res.status(200);
    res.send("Success");
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
    res.send(profile);
  } catch (err) {
    res.send(err);
  }
});

// const getCategoryId = async (name) => {
//   try {
//     const categoryId = await prisma.category.findUnique({
//       where: {
//         name: name
//       },
//       select: {
//         id: true,
//       }
//     });
//     print("Category Id: " + categoryId)
//     return categoryId
//   } catch (err) {
//     return err;
//   }
// }

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
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    res.send(posts);
  } catch (err) {
    throw err;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
